// 配置存储系统
const fs = require('fs').promises;
const path = require('path');

class PetConfig {
    constructor() {
        this.configPath = path.join(__dirname, 'pet-config.json');
        this.config = {
            position: { x: null, y: null },
            mood: 'happy', // happy, thinking, busy, sleepy
            theme: 'default',
            voiceEnabled: true,
            lastSeen: Date.now()
        };
    }

    async load() {
        try {
            const data = await fs.readFile(this.configPath, 'utf-8');
            this.config = { ...this.config, ...JSON.parse(data) };
            console.log('✅ 配置加载成功:', this.config);
        } catch (err) {
            console.log('📝 使用默认配置');
        }
        return this.config;
    }

    async save() {
        try {
            await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
            console.log('💾 配置已保存');
        } catch (err) {
            console.error('❌ 保存配置失败:', err);
        }
    }

    set(key, value) {
        this.config[key] = value;
        this.save();
    }

    get(key) {
        return this.config[key];
    }
}

module.exports = PetConfig;
