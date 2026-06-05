const ROLES = {
    'Warrior': {
        name: '戰士', icon: '⚔️', hp: 120, atk: 15, def: 8,
        skills: {
            1: { name: '斬擊', damage: 25, type: 'physical' },
            2: { name: '盾擊', damage: 18, type: 'physical', effect: 'reduce_damage' },
            3: { name: '狂戰', damage: 35, type: 'physical', cost: 10 }
        }
    },
    'Mage': {
        name: '法師', icon: '🔥', hp: 80, atk: 22, def: 4,
        skills: {
            1: { name: '火球術', damage: 30, type: 'magic' },
            2: { name: '冰凍', damage: 20, type: 'magic', effect: 'slow_enemy' },
            3: { name: '流星火雨', damage: 40, type: 'magic', cost: 15 }
        }
    },
    'Archer': {
        name: '弓箭手', icon: '🏹', hp: 100, atk: 18, def: 6,
        skills: {
            1: { name: '連射', damage: 24, type: 'physical' },
            2: { name: '穿透箭', damage: 32, type: 'physical' },
            3: { name: '箭雨', damage: 28, type: 'physical', effect: 'multi_hit' }
        }
    },
    'Paladin': {
        name: '聖騎士', icon: '✨', hp: 110, atk: 13, def: 12,
        skills: {
            1: { name: '聖擊', damage: 20, type: 'holy' },
            2: { name: '神聖盾', damage: 15, type: 'holy', effect: 'heal_self' },
            3: { name: '聖光裁決', damage: 32, type: 'holy', cost: 12 }
        }
    }
};

const STAGE_CONFIG = {
    1: { name: '第一關 - 新手村', smallMonsters: 2, smallMonsterHp: 40, smallMonsterAtk: 8, bossHp: 100, bossAtk: 12, eliteChance: 0.2 },
    2: { name: '第二關 - 黑暗森林', smallMonsters: 3, smallMonsterHp: 60, smallMonsterAtk: 12, bossHp: 150, bossAtk: 15, eliteChance: 0.2 },
    3: { name: '第三關 - 龍之城堡', smallMonsters: 4, smallMonsterHp: 80, smallMonsterAtk: 15, bossHp: 200, bossAtk: 18, eliteChance: 0.2 },
    4: { name: '第四關 - 深淵之門', smallMonsters: 5, smallMonsterHp: 100, smallMonsterAtk: 18, bossHp: 250, bossAtk: 22, eliteChance: 0.25 },
    5: { name: '第五關 - 終極之地', smallMonsters: 6, smallMonsterHp: 120, smallMonsterAtk: 22, bossHp: 300, bossAtk: 25, eliteChance: 0.3 }
};

const WEAPONS = [
    { id: 1, name: '鐵劍', atk: 5, rarity: 'common', price: 50 },
    { id: 2, name: '鋼劍', atk: 10, rarity: 'uncommon', price: 150 },
    { id: 3, name: '魔劍', atk: 15, rarity: 'rare', price: 300 },
    { id: 4, name: '傳奇劍', atk: 25, rarity: 'epic', price: 800 },
    { id: 5, name: '屠龍刀', atk: 40, rarity: 'legendary', price: 2000 }
];

const ARMOR = [
    { id: 1, name: '皮甲', def: 3, hp: 10, rarity: 'common', price: 50 },
    { id: 2, name: '鐵甲', def: 6, hp: 20, rarity: 'uncommon', price: 150 },
    { id: 3, name: '魔甲', def: 10, hp: 40, rarity: 'rare', price: 300 },
    { id: 4, name: '龍甲', def: 15, hp: 80, rarity: 'epic', price: 800 },
    { id: 5, name: '神聖甲', def: 20, hp: 150, rarity: 'legendary', price: 2000 }
];

const CONSUMABLES = [
    { id: 1, name: '小血瓶', heal: 30, rarity: 'common', price: 20 },
    { id: 2, name: '中血瓶', heal: 60, rarity: 'uncommon', price: 50 },
    { id: 3, name: '大血瓶', heal: 100, rarity: 'rare', price: 150 },
    { id: 4, name: '完美恢復藥', heal: 'full', rarity: 'epic', price: 300 }
];

let gameState = {
    player: null,
    monster: null,
    currentStage: 1,
    currentMonsterIndex: 0,
    totalMonstersInStage: 0,
    inBattle: false,
    actionInProgress: false,
    bossFightActive: false,
    eliteFightActive: false,
    defeatedInStage: 0,
    inRestArea: false,
    inventory: {
        weapons: [],
        armor: [],
        consumables: [],
        money: 200
    },
    equipped: {
        weapon: null,
        armor: null
    }
};

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function addLog(msg) {
    const log = document.getElementById('logContent');
    if (!log) return;
    const p = document.createElement('p');
    p.className = 'log-item';
    p.textContent = msg;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

function createDamageNumber(damage, x, y) {
    const div = document.createElement('div');
    div.className = 'damage-number damage';
    div.textContent = '-' + damage;
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    document.getElementById('damageNumbers').appendChild(div);
    setTimeout(() => div.remove(), 1000);
}

function updateUI() {
    const hpPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
    const bar = document.getElementById('playerHpBar');
    if (bar) {
        bar.style.width = hpPercent + '%';
        if (hpPercent < 30) bar.classList.add('low');
        else bar.classList.remove('low');
    }
    const hpText = document.getElementById('playerHpText');
    if (hpText) hpText.textContent = gameState.player.hp + '/' + gameState.player.maxHp;
    
    const mhpPercent = (gameState.monster.hp / gameState.monster.maxHp) * 100;
    const mbar = document.getElementById('monsterHpBar');
    if (mbar) mbar.style.width = mhpPercent + '%';
    const mhpText = document.getElementById('monsterHpText');
    if (mhpText) mhpText.textContent = gameState.monster.hp + '/' + gameState.monster.maxHp;
}

function calculateDamage(atk, isSkill = false, skillId = 1) {
    let dmg = isSkill ? atk.skills[skillId].damage : atk.atk;
    const variance = 0.8 + Math.random() * 0.4;
    return Math.floor(dmg * variance);
}

function selectRole(role, el) {
    const cfg = ROLES[role];
    gameState.player = {
        ...cfg,
        maxHp: cfg.hp,
        level: 1,
        xp: 0,
        xpToNext: 100,
        def: cfg.def
    };
    gameState.equipped.weapon = WEAPONS[0];
    gameState.equipped.armor = ARMOR[0];
    gameState.inventory.weapons = [WEAPONS[0]];
    gameState.inventory.armor = [ARMOR[0]];
    gameState.inventory.consumables = [{ ...CONSUMABLES[0], quantity: 3 }];
    
    document.querySelectorAll('.card').forEach(c => c.style.opacity = '0.2');
    el.style.opacity = '1';
    setTimeout(() => startNewGame(), 800);
}

function startNewGame() {
    gameState.currentStage = 1;
    gameState.currentMonsterIndex = 0;
    gameState.defeatedInStage = 0;
    gameState.player.hp = gameState.player.maxHp;
    document.getElementById('playerNameBattle').textContent = gameState.player.name;
    document.getElementById('playerIcon').textContent = gameState.player.icon;
    startStage();
}

function startStage() {
    const cfg = STAGE_CONFIG[gameState.currentStage];
    gameState.totalMonstersInStage = cfg.smallMonsters;
    gameState.currentMonsterIndex = 0;
    gameState.bossFightActive = false;
    gameState.eliteFightActive = false;
    gameState.defeatedInStage = 0;
    
    document.getElementById('stageName').textContent = cfg.name;
    document.getElementById('logContent').innerHTML = '';
    addLog('🗡️ ' + cfg.name + ' 開始！');
    addLog('本關需要擊敗 ' + cfg.smallMonsters + ' 隻小怪和 1 個 Boss！');
    
    startNextBattle();
}

function startNextBattle() {
    gameState.actionInProgress = false;
    const cfg = STAGE_CONFIG[gameState.currentStage];
    gameState.currentMonsterIndex++;
    const isBoss = (gameState.currentMonsterIndex > cfg.smallMonsters);
    const isElite = !isBoss && Math.random() < cfg.eliteChance;
    
    gameState.bossFightActive = isBoss;
    gameState.eliteFightActive = isElite;
    
    if (isBoss) {
        gameState.monster = {
            name: '【第' + gameState.currentStage + '關Boss】',
            icon: '🔥',
            hp: cfg.bossHp,
            maxHp: cfg.bossHp,
            atk: cfg.bossAtk,
            def: 5,
            isBoss: true,
            isElite: false,
            skills: { 1: { name: '力量一擊', damage: 25 }, 2: { name: '地獄猛擊', damage: 35 }, 3: { name: '毀滅之力', damage: 45 } }
        };
        document.getElementById('stageProgress').textContent = '⚡ Boss戰 - 最終決戰';
        addLog('⚠️ Boss 出現！');
    } else if (isElite) {
        const eliteNames = ['冰霜', '烈焰', '雷電', '暗影', '聖光'];
        const randomName = eliteNames[Math.floor(Math.random() * eliteNames.length)];
        gameState.monster = {
            name: '【精英怪】' + randomName + '怪物',
            icon: '👹',
            hp: Math.floor((cfg.smallMonsterHp + gameState.currentStage * 10) * 1.5),
            maxHp: Math.floor((cfg.smallMonsterHp + gameState.currentStage * 10) * 1.5),
            atk: Math.floor((cfg.smallMonsterAtk + gameState.currentStage * 2) * 1.2),
            def: 3,
            isBoss: false,
            isElite: true,
            skills: { 1: { name: '普通攻擊', damage: 15 }, 2: { name: '重擊', damage: 25 }, 3: { name: '狂暴', damage: 35 } }
        };
        document.getElementById('stageProgress').textContent = '精英怪 ' + gameState.currentMonsterIndex + '/' + cfg.smallMonsters;
        addLog('⭐ 精英怪出現了！');
    } else {
        gameState.monster = {
            name: '小怪 ' + gameState.currentMonsterIndex + '/' + cfg.smallMonsters,
            icon: '👹',
            hp: cfg.smallMonsterHp + gameState.currentStage * 10,
            maxHp: cfg.smallMonsterHp + gameState.currentStage * 10,
            atk: cfg.smallMonsterAtk + gameState.currentStage * 2,
            def: 2,
            isBoss: false,
            isElite: false,
            skills: { 1: { name: '普通攻擊', damage: 15 }, 2: { name: '重擊', damage: 25 }, 3: { name: '狂暴', damage: 35 } }
        };
        document.getElementById('stageProgress').textContent = '小怪 ' + gameState.currentMonsterIndex + '/' + cfg.smallMonsters;
        addLog('小怪出現了！第 ' + gameState.currentMonsterIndex + ' 個對手！');
    }
    
    gameState.inBattle = true;
    document.getElementById('monsterName').textContent = gameState.monster.name;
    document.getElementById('monsterIcon').textContent = gameState.monster.icon;
    document.getElementById('attackBtn').disabled = false;
    document.getElementById('skillBtn').disabled = false;
    document.getElementById('skillMenu').style.display = 'none';
    updateUI();
    showScreen('battleScreen');
}

function playerAttack() {
    if (gameState.actionInProgress) return;
    gameState.actionInProgress = true;
    
    const baseDamage = calculateDamage(gameState.player);
    const weaponBonus = gameState.equipped.weapon ? gameState.equipped.weapon.atk : 0;
    const monsterDef = gameState.monster.def || 0;
    const finalDamage = Math.max(1, Math.floor(baseDamage + weaponBonus - monsterDef * 0.3));
    
    gameState.monster.hp = Math.max(0, gameState.monster.hp - finalDamage);
    
    addLog(gameState.player.name + ' 攻擊，造成 ' + finalDamage + ' 點傷害！');
    createDamageNumber(finalDamage, Math.random() * 400 + 300, Math.random() * 300 + 400);
    updateUI();
    
    setTimeout(() => {
        if (gameState.monster.hp <= 0) battleEnd(true);
        else monsterTurn();
    }, 800);
}

function showSkillMenu() {
    const menu = document.getElementById('skillMenu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function hideSkillMenu() {
    const menu = document.getElementById('skillMenu');
    if (menu) menu.style.display = 'none';
}

function playerUseSkill(id) {
    if (gameState.actionInProgress) return;
    gameState.actionInProgress = true;
    hideSkillMenu();
    
    const skill = gameState.player.skills[id];
    const baseDamage = calculateDamage(gameState.player, true, id);
    const weaponBonus = gameState.equipped.weapon ? gameState.equipped.weapon.atk : 0;
    const monsterDef = gameState.monster.def || 0;
    const finalDamage = Math.max(1, Math.floor(baseDamage + weaponBonus * 0.5 - monsterDef * 0.2));
    
    gameState.monster.hp = Math.max(0, gameState.monster.hp - finalDamage);
    
    addLog(gameState.player.name + ' 使用【' + skill.name + '】，造成 ' + finalDamage + ' 點傷害！');
    createDamageNumber(finalDamage, Math.random() * 400 + 300, Math.random() * 300 + 400);
    updateUI();
    
    setTimeout(() => {
        if (gameState.monster.hp <= 0) battleEnd(true);
        else monsterTurn();
    }, 800);
}

function monsterTurn() {
    addLog(gameState.monster.name + ' 發動攻擊...');
    setTimeout(() => {
        const skillId = Math.floor(Math.random() * 3) + 1;
        const skill = gameState.monster.skills[skillId];
        const baseDamage = calculateDamage(gameState.monster, true, skillId);
        const playerDef = gameState.player.def + (gameState.equipped.armor ? gameState.equipped.armor.def : 0);
        const finalDamage = Math.max(1, Math.floor(baseDamage - playerDef * 0.4));
        
        gameState.player.hp = Math.max(0, gameState.player.hp - finalDamage);
        
        addLog(gameState.monster.name + ' 使用【' + skill.name + '】，造成 ' + finalDamage + ' 點傷害！');
        createDamageNumber(finalDamage, Math.random() * 400 + 100, Math.random() * 300 + 100);
        updateUI();
        
        setTimeout(() => {
            if (gameState.player.hp <= 0) gameOver();
            else {
                gameState.actionInProgress = false;
                document.getElementById('attackBtn').disabled = false;
                document.getElementById('skillBtn').disabled = false;
            }
        }, 800);
    }, 500);
}

function battleEnd(won) {
    gameState.inBattle = false;
    if (!won) { gameOver(); return; }
    
    gameState.defeatedInStage++;
    const reward = 30 + gameState.currentStage * 10;
    const bonusReward = gameState.monster.isElite ? Math.floor(reward * 1.5) : 0;
    gameState.player.xp += reward + bonusReward;
    
    let msg = '<p>你擊敗了 ' + gameState.monster.name + '！</p><p>獲得 ' + (reward + bonusReward) + ' XP</p>';
    
    if (gameState.player.xp >= gameState.player.xpToNext) {
        gameState.player.level++;
        gameState.player.xpToNext = Math.floor(gameState.player.xpToNext * 1.2);
        gameState.player.maxHp += 10;
        gameState.player.hp = Math.min(gameState.player.hp + 20, gameState.player.maxHp);
        gameState.player.atk += 5;
        msg += '<p>⭐ 升級到 Lv.' + gameState.player.level + '！</p>';
    }
    
    // Boss 掉落
    if (gameState.monster.isBoss) {
        const bonus = 5 + gameState.currentStage * 2;
        gameState.player.atk += bonus;
        msg += '<p>🎁 Boss掉落：攻擊力 +' + bonus + '</p>';
        
        // 掉落裝備
        const dropWeapon = WEAPONS[Math.min(gameState.currentStage, WEAPONS.length - 1)];
        const dropArmor = ARMOR[Math.min(gameState.currentStage, ARMOR.length - 1)];
        gameState.inventory.weapons.push(dropWeapon);
        gameState.inventory.armor.push(dropArmor);
        msg += '<p>📦 獲得：' + dropWeapon.name + ' 與 ' + dropArmor.name + '</p>';
    } else if (gameState.monster.isElite) {
        const bonus = 3 + gameState.currentStage;
        gameState.player.atk += bonus;
        msg += '<p>✨ 精英怪掉落：攻擊力 +' + bonus + '</p>';
        gameState.inventory.money += 50;
    }
    
    document.getElementById('resultDetails').innerHTML = msg;
    
    if (gameState.monster.isBoss && gameState.currentStage >= 5) {
        document.getElementById('nextBtn').textContent = '🏆 查看通關結果';
    } else if (gameState.monster.isBoss) {
        document.getElementById('nextBtn').textContent = '進入下一關';
    } else {
        document.getElementById('nextBtn').textContent = '繼續戰鬥';
    }
    
    showScreen('resultScreen');
}

function nextBattle() {
    const cfg = STAGE_CONFIG[gameState.currentStage];
    
    if (gameState.bossFightActive) {
        if (gameState.currentStage >= 5) {
            const stats = '<p>🏆 恭喜通關所有 5 關！</p><p>最終等級：Lv.' + gameState.player.level + '</p><p>最終攻擊力：' + gameState.player.atk + '</p><p>最終 HP：' + gameState.player.maxHp + '</p>';
            document.getElementById('finalStats').innerHTML = stats;
            showScreen('completeScreen');
            return;
        }
        gameState.currentStage++;
        startStage();
    } else {
        startNextBattle();
    }
}

function gameOver() {
    const stats = '<p>到達階段：第 ' + gameState.currentStage + ' 關</p><p>擊敗對手數：' + gameState.defeatedInStage + '</p><p>最終等級：Lv.' + gameState.player.level + '</p><p>最終攻擊力：' + gameState.player.atk + '</p>';
    document.getElementById('gameOverStats').innerHTML = stats;
    showScreen('gameOverScreen');
}

function restartGame() {
    gameState = {
        player: null, monster: null, currentStage: 1, currentMonsterIndex: 0,
        totalMonstersInStage: 0, inBattle: false, actionInProgress: false,
        bossFightActive: false, eliteFightActive: false, defeatedInStage: 0,
        inRestArea: false,
        inventory: { weapons: [], armor: [], consumables: [], money: 200 },
        equipped: { weapon: null, armor: null }
    };
    document.querySelectorAll('.card').forEach(c => c.style.opacity = '1');
    showScreen('selectionScreen');
}

document.addEventListener('DOMContentLoaded', () => showScreen('selectionScreen'));
