/**
 * 🔄 Model Switcher — CC Switch 风格的模型切换器
 * 
 * 功能：
 * - 读取 OpenClaw 配置获取所有可用模型
 * - 通过 Gateway REST API 切换当前 session 的模型
 * - 提供快捷键切换 (类似 CC 的 Cmd+/ switch)
 * - 在球体上显示当前模型标识
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

class ModelSwitcher {
  constructor(options = {}) {
    this.configPath = options.configPath || 
      path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'openclaw.json');
    this.gatewayPort = options.port || 18789;
    this.gatewayToken = options.token || '';
    
    this.models = [];        // 所有可用模型
    this.currentModel = null; // 当前激活模型
    this.currentIndex = 0;    // 当前模型索引
    this.listeners = [];      // 变更监听器
    
    this._loadConfig();
  }

  /**
   * 从 OpenClaw 配置文件读取模型列表
   */
  _loadConfig() {
    try {
      const raw = fs.readFileSync(this.configPath, 'utf8');
      const config = JSON.parse(raw);
      
      // 提取 gateway 配置
      this.gatewayPort = config.gateway?.port || 18789;
      this.gatewayToken = config.gateway?.auth?.token || this.gatewayToken;
      
      // 提取所有 provider 下的模型
      this.models = [];
      const providers = config.models?.providers || {};
      
      for (const [providerName, providerConfig] of Object.entries(providers)) {
        const modelList = providerConfig.models || [];
        for (const model of modelList) {
          this.models.push({
            id: `${providerName}/${model.id}`,
            name: model.name || model.id,
            shortName: this._getShortName(model.id),
            provider: providerName,
            modelId: model.id,
            api: model.api || providerConfig.api,
            reasoning: model.reasoning || false,
            contextWindow: model.contextWindow || 200000,
            // 模型图标/颜色
            color: this._getModelColor(model.id),
            icon: this._getModelIcon(model.id),
          });
        }
      }
      
      // 获取当前默认模型
      const primaryModel = config.agents?.defaults?.model?.primary;
      if (primaryModel) {
        this.currentIndex = this.models.findIndex(m => m.id === primaryModel);
        if (this.currentIndex === -1) this.currentIndex = 0;
        this.currentModel = this.models[this.currentIndex] || null;
      }
      
      console.log(`🔄 ModelSwitcher: 加载了 ${this.models.length} 个模型, 当前: ${this.currentModel?.shortName || '?'}`);
    } catch (err) {
      console.error('❌ ModelSwitcher 配置加载失败:', err.message);
    }
  }

  /**
   * 获取模型短名称 (用于UI显示)
   */
  _getShortName(modelId) {
    const map = {
      'claude-opus-4-6': 'Opus 4',
      'claude-sonnet-4-5-20250929': 'Sonnet 4.5',
      'claude-haiku-4-5-20251001': 'Haiku 4.5',
      'claude-sonnet-4-5': 'Sonnet 4.5',
      'claude-opus-4': 'Opus 4',
      'claude-haiku-4': 'Haiku 4',
      'gpt-4o': 'GPT-4o',
      'gpt-4o-mini': 'GPT-4o Mini',
      'gemini-2.0-flash': 'Gemini Flash',
      'gemini-2.5-pro': 'Gemini Pro',
    };
    
    // 精确匹配
    if (map[modelId]) return map[modelId];
    
    // 模糊匹配
    for (const [key, val] of Object.entries(map)) {
      if (modelId.includes(key)) return val;
    }
    
    // 默认：取最后一段，首字母大写
    const parts = modelId.split('-');
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }

  /**
   * 获取模型对应的颜色 (用于球体变色)
   */
  _getModelColor(modelId) {
    if (modelId.includes('opus')) return '#E8A838';     // 金色 — 最强
    if (modelId.includes('sonnet')) return '#7C6BF0';   // 紫色 — 均衡
    if (modelId.includes('haiku')) return '#4ECDC4';    // 青色 — 轻快
    if (modelId.includes('gpt-4o-mini')) return '#74AA9C'; // 浅绿
    if (modelId.includes('gpt-4o')) return '#10A37F';   // OpenAI绿
    if (modelId.includes('gemini')) return '#4285F4';   // Google蓝
    return '#FF6B6B'; // 默认红
  }

  /**
   * 获取模型图标标识 (2-3个字符)
   */
  _getModelIcon(modelId) {
    if (modelId.includes('opus')) return 'OP';
    if (modelId.includes('sonnet')) return 'SN';
    if (modelId.includes('haiku')) return 'HK';
    if (modelId.includes('gpt-4o-mini')) return '4m';
    if (modelId.includes('gpt-4o')) return '4o';
    if (modelId.includes('gemini')) return 'GM';
    return '??';
  }

  /**
   * 获取所有模型列表
   */
  getModels() {
    return this.models;
  }

  /**
   * 获取当前模型
   */
  getCurrent() {
    return this.currentModel;
  }

  /**
   * 切换到下一个模型 (循环)
   */
  async next() {
    if (this.models.length <= 1) return this.currentModel;
    this.currentIndex = (this.currentIndex + 1) % this.models.length;
    return this._applySwitch();
  }

  /**
   * 切换到上一个模型 (循环)
   */
  async prev() {
    if (this.models.length <= 1) return this.currentModel;
    this.currentIndex = (this.currentIndex - 1 + this.models.length) % this.models.length;
    return this._applySwitch();
  }

  /**
   * 切换到指定模型
   */
  async switchTo(modelId) {
    const idx = this.models.findIndex(m => m.id === modelId || m.modelId === modelId);
    if (idx === -1) {
      console.error(`❌ 未找到模型: ${modelId}`);
      return null;
    }
    this.currentIndex = idx;
    return this._applySwitch();
  }

  /**
   * 应用模型切换 — 通过 OpenClaw Gateway API
   */
  async _applySwitch() {
    this.currentModel = this.models[this.currentIndex];
    console.log(`🔄 切换模型 → ${this.currentModel.shortName} (${this.currentModel.id})`);

    try {
      // 通过 session_status API 设置模型覆盖
      // OpenClaw 支持 per-session model override
      const result = await this._gatewayRequest('POST', '/api/sessions/main/model', {
        model: this.currentModel.id
      });
      
      console.log(`✅ Gateway 模型切换成功: ${this.currentModel.shortName}`);
    } catch (err) {
      console.warn(`⚠️ Gateway API 切换失败, 尝试 config patch...`, err.message);
      
      // 降级方案：直接修改配置文件
      try {
        await this._patchConfig(this.currentModel.id);
        console.log(`✅ 配��文件已更新: ${this.currentModel.shortName}`);
      } catch (err2) {
        console.error(`❌ 模型切换完全失败:`, err2.message);
      }
    }
    
    // 通知所有监听器
    this._notifyListeners();
    
    return this.currentModel;
  }

  /**
   * 通过 Gateway REST API 发请求
   */
  _gatewayRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port: this.gatewayPort,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.gatewayToken}`
        },
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  /**
   * 降级方案：直接修改 openclaw.json 配置文件
   */
  async _patchConfig(modelId) {
    const raw = fs.readFileSync(this.configPath, 'utf8');
    const config = JSON.parse(raw);
    
    // 更新 primary model
    if (!config.agents) config.agents = {};
    if (!config.agents.defaults) config.agents.defaults = {};
    if (!config.agents.defaults.model) config.agents.defaults.model = {};
    config.agents.defaults.model.primary = modelId;
    
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf8');
  }

  /**
   * 注册模型变更监听器
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * 通知所有监听器
   */
  _notifyListeners() {
    for (const cb of this.listeners) {
      try {
        cb(this.currentModel, this.currentIndex, this.models);
      } catch (err) {
        console.error('ModelSwitcher listener error:', err);
      }
    }
  }

  /**
   * 刷新配置（重新读取）
   */
  reload() {
    this._loadConfig();
    this._notifyListeners();
  }

  /**
   * 获取托盘菜单项
   */
  getTrayMenuItems() {
    return this.models.map((model, idx) => ({
      label: `${idx === this.currentIndex ? '✓ ' : '   '}${model.icon} ${model.shortName}`,
      type: 'radio',
      checked: idx === this.currentIndex,
      click: () => this.switchTo(model.id)
    }));
  }

  /**
   * 获取状态文本
   */
  getStatusText() {
    if (!this.currentModel) return 'No Model';
    return `${this.currentModel.icon} ${this.currentModel.shortName}`;
  }
}

module.exports = ModelSwitcher;
