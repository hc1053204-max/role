const ROLES = {
    'Warrior': {
        name: '戰士', icon: '⚔️', hp: 150, atk: 18, def: 12,
        skills: {
            1: { name: '斬擊', damage: 22, type: 'physical' },
            2: { name: '盾擊', damage: 16, type: 'physical', effect: 'reduce_damage' },
            3: { name: '狂戰', damage: 30, type: 'physical', cost: 10 }
        }
    },
    'Mage': {
        name: '法師', icon: '🔥', hp: 100, atk: 24, def: 6,
        skills: {
            1: { name: '火球術', damage: 28, type: 'magic' },
            2: { name: '冰凍', damage: 18, type: 'magic', effect: 'slow_enemy' },
            3: { name: '流星火雨', damage: 36, type: 'magic', cost: 15 }
        }
    },
    'Archer': {
        name: '弓箭手', icon: '🏹', hp: 120, atk: 20, def: 8,
        skills: {
            1: { name: '連射', damage: 22, type: 'physical' },
            2: { name: '穿透箭', damage: 28, type: 'physical' },
            3: { name: '箭雨', damage: 25, type: 'physical', effect: 'multi_hit' }
        }
    },
    'Paladin': {
        name: '聖騎士', icon: '✨', hp: 140, atk: 15, def: 15,
        skills: {
            1: { name: '聖擊', damage: 18, type: 'holy' },
            2: { name: '神聖盾', damage: 13, type: 'holy', effect: 'heal_self' },
            3: { name: '聖光裁決', damage: 28, type: 'holy', cost: 12 }
        }
    },
    'Assassin': {
        name: '刺客', icon: '🗡️', hp: 110, atk: 28, def: 6,
        skills: {
            1: { name: '連刺', damage: 26, type: 'physical', effect: 'multi_hit' },
            2: { name: '致命一擊', damage: 40, type: 'physical', effect: 'critical' },
            3: { name: '暗影突襲', damage: 45, type: 'physical', cost: 12 }
        },
        passive: { name: '致命打擊', desc: '20% 機率造成雙倍傷害' }
    },
    'Priest': {
        name: '聖祭司', icon: '🙏', hp: 130, atk: 14, def: 10,
        skills: {
            1: { name: '聖光箭', damage: 18, type: 'holy' },
            2: { name: '治癒光環', damage: 12, type: 'heal', effect: 'heal_self' },
            3: { name: '聖靈復甦', damage: 20, type: 'holy', effect: 'heal_and_damage', cost: 14 }
        },
        passive: { name: '聖潔庇佑', desc: '每回合恢復最大 HP 的 5%' }
    },
    'Druid': {
        name: '德魯伊', icon: '🌲', hp: 125, atk: 17, def: 11,
        skills: {
            1: { name: '藤蔓鞭打', damage: 20, type: 'nature' },
            2: { name: '熊之怒', damage: 32, type: 'nature', effect: 'transform' },
            3: { name: '自然之力', damage: 28, type: 'nature', effect: 'multi_effect', cost: 13 }
        },
        passive: { name: '自然回歸', desc: '戰鬥後恢復 10% 最大 HP' }
    },
    'ShadowHunter': {
        name: '暗影獵人', icon: '🌑', hp: 115, atk: 22, def: 8,
        skills: {
            1: { name: '暗影箭', damage: 24, type: 'shadow', effect: 'poison' },
            2: { name: '詛咒印記', damage: 16, type: 'shadow', effect: 'curse' },
            3: { name: '暗影獵殺', damage: 38, type: 'shadow', cost: 15 }
        },
        passive: { name: '持續詛咒', desc: '敵人每回合受到額外傷害' }
    },
    'DragonKnight': {
        name: '龍騎士', icon: '🐉', hp: 170, atk: 16, def: 20,
        skills: {
            1: { name: '龍之怒火', damage: 22, type: 'fire' },
            2: { name: '龍鱗防禦', damage: 10, type: 'defense', effect: 'reflect_damage' },
            3: { name: '末日烈焰', damage: 35, type: 'fire', cost: 16 }
        },
        passive: { name: '龍心韌性', desc: '受到傷害時反射 30% 傷害給敵人' }
    }
};

const STAGE_CONFIG = {
    1: { name: '第一關 - 新手村', smallMonsters: 2, smallMonsterHp: 35, smallMonsterAtk: 6, bossHp: 80, bossAtk: 8, eliteChance: 0.15 },
    2: { name: '第二關 - 黑暗森林', smallMonsters: 3, smallMonsterHp: 50, smallMonsterAtk: 9, bossHp: 120, bossAtk: 11, eliteChance: 0.18 },
    3: { name: '第三關 - 龍之城堡', smallMonsters: 4, smallMonsterHp: 70, smallMonsterAtk: 12, bossHp: 160, bossAtk: 14, eliteChance: 0.2 },
    4: { name: '第四關 - 深淵之門', smallMonsters: 5, smallMonsterHp: 90, smallMonsterAtk: 15, bossHp: 200, bossAtk: 17, eliteChance: 0.22 },
    5: { name: '第五關 - 終極之地', smallMonsters: 6, smallMonsterHp: 110, smallMonsterAtk: 18, bossHp: 250, bossAtk: 20, eliteChance: 0.25 }
};

const WEAPONS = [
    { id: 1, name: '鐵劍', atk: 3, rarity: 'common', price: 50 },
    { id: 2, name: '鋼劍', atk: 7, rarity: 'uncommon', price: 150 },
    { id: 3, name: '魔劍', atk: 12, rarity: 'rare', price: 300 },
    { id: 4, name: '傳奇劍', atk: 18, rarity: 'epic', price: 800 },
    { id: 5, name: '屠龍刀', atk: 30, rarity: 'legendary', price: 2000 }
];

const ARMOR = [
    { id: 1, name: '皮甲', def: 4, hp: 15, rarity: 'common', price: 50 },
    { id: 2, name: '鐵甲', def: 8, hp: 30, rarity: 'uncommon', price: 150 },
    { id: 3, name: '魔甲', def: 12, hp: 50, rarity: 'rare', price: 300 },
    { id: 4, name: '龍甲', def: 18, hp: 100, rarity: 'epic', price: 800 },
    { id: 5, name: '神聖甲', def: 24, hp: 180, rarity: 'legendary', price: 2000 }
];

const CONSUMABLES = [
    { id: 1, name: '小血瓶', heal: 40, rarity: 'common', price: 20 },
    { id: 2, name: '中血瓶', heal: 80, rarity: 'uncommon', price: 50 },
    { id: 3, name: '大血瓶', heal: 150, rarity: 'rare', price: 150 },
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
        money: 300
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
    const variance = 0.85 + Math.random() * 0.3;
    let damage = Math.floor(dmg * variance);
    
    // 刺客被動：20% 機率雙倍傷害
    if (gameState.player.name === '刺客' && Math.random() < 0.2) {
        damage *= 2;
        addLog('💥 致命打擊！傷害翻倍！');
    }
    
    return damage;
}

function selectRole(role, el) {
    const cfg = ROLES[role];
    gameState.player = {
        ...cfg,
        maxHp: cfg.hp,
        level: 1,
        xp: 0,
        xpToNext: 80,
        def: cfg.def,
        curseDamage: 0
    };
    gameState.equipped.weapon = WEAPONS[0];
    gameState.equipped.armor = ARMOR[0];
    gameState.inventory.weapons = [WEAPONS[0]];
    gameState.inventory.armor = [ARMOR[0]];
    gameState.inventory.consumables = [{ ...CONSUMABLES[0], quantity: 5 }];
    
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
            def: 3,
            isBoss: true,
            isElite: false,
            skills: { 1: { name: '力量一擊', damage: 20 }, 2: { name: '地獄猛擊', damage: 28 }, 3: { name: '毀滅之力', damage: 35 } }
        };
        document.getElementById('stageProgress').textContent = '⚡ Boss戰 - 最終決戰';
        addLog('⚠️ Boss 出現！');
    } else if (isElite) {
        const eliteNames = ['冰霜', '烈焰', '雷電', '暗影', '聖光'];
        const randomName = eliteNames[Math.floor(Math.random() * eliteNames.length)];
        gameState.monster = {
            name: '【精英怪】' + randomName + '怪物',
            icon: '👹',
            hp: Math.floor((cfg.smallMonsterHp + gameState.currentStage * 8) * 1.4),
            maxHp: Math.floor((cfg.smallMonsterHp + gameState.currentStage * 8) * 1.4),
            atk: Math.floor((cfg.smallMonsterAtk + gameState.currentStage * 1.5) * 1.1),
            def: 2,
            isBoss: false,
            isElite: true,
            skills: { 1: { name: '普通攻擊', damage: 12 }, 2: { name: '重擊', damage: 20 }, 3: { name: '狂暴', damage: 28 } }
        };
        document.getElementById('stageProgress').textContent = '精英怪 ' + gameState.currentMonsterIndex + '/' + cfg.smallMonsters;
        addLog('⭐ 精英怪出現了！');
    } else {
        gameState.monster = {
            name: '小怪 ' + gameState.currentMonsterIndex + '/' + cfg.smallMonsters,
            icon: '👹',
            hp: cfg.smallMonsterHp + gameState.currentStage * 8,
            maxHp: cfg.smallMonsterHp + gameState.currentStage * 8,
            atk: cfg.smallMonsterAtk + gameState.currentStage * 1.5,
            def: 1,
            isBoss: false,
            isElite: false,
            skills: { 1: { name: '普通攻擊', damage: 12 }, 2: { name: '重擊', damage: 20 }, 3: { name: '狂暴', damage: 28 } }
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
    const finalDamage = Math.max(2, Math.floor(baseDamage + weaponBonus - monsterDef * 0.2));
    
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
    let baseDamage = calculateDamage(gameState.player, true, id);
    const weaponBonus = gameState.equipped.weapon ? gameState.equipped.weapon.atk : 0;
    const monsterDef = gameState.monster.def || 0;
    
    // 聖祭司治療技能
    if (gameState.player.name === '聖祭司' && skill.effect === 'heal_self') {
        const healAmount = 40;
        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
        addLog(gameState.player.name + ' 使用【' + skill.name + '】，恢復 ' + healAmount + ' HP！');
        createDamageNumber('+' + healAmount, Math.random() * 400 + 100, Math.random() * 300 + 100);
    } else if (gameState.player.name === '聖祭司' && skill.effect === 'heal_and_damage') {
        const healAmount = 60;
        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
        const finalDamage = Math.max(2, Math.floor(baseDamage + weaponBonus * 0.4 - monsterDef * 0.15));
        gameState.monster.hp = Math.max(0, gameState.monster.hp - finalDamage);
        addLog(gameState.player.name + ' 使用【' + skill.name + '】，造成 ' + finalDamage + ' 點傷害，恢復 ' + healAmount + ' HP！');
        createDamageNumber(finalDamage, Math.random() * 400 + 300, Math.random() * 300 + 400);
    } else if (gameState.player.name === '暗影獵人' && skill.effect === 'curse') {
        // 詛咒效果：敵人未來 3 回合受到額外傷害
        gameState.monster.curseDuration = 3;
        addLog(gameState.player.name + ' 使用【' + skill.name + '】，在敵人身上施加詛咒！');
    } else if (gameState.player.name === '龍騎士' && skill.effect === 'reflect_damage') {
        // 龍鱗防禦：下一回合反射傷害
        gameState.player.reflectActive = true;
        addLog(gameState.player.name + ' 使用【' + skill.name + '】，啟動龍鱗防禦！');
    } else {
        const finalDamage = Math.max(2, Math.floor(baseDamage + weaponBonus * 0.4 - monsterDef * 0.15));
        gameState.monster.hp = Math.max(0, gameState.monster.hp - finalDamage);
        addLog(gameState.player.name + ' 使用【' + skill.name + '】，造成 ' + finalDamage + ' 點傷害！');
        createDamageNumber(finalDamage, Math.random() * 400 + 300, Math.random() * 300 + 400);
    }
    
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
        let finalDamage = Math.max(1, Math.floor(baseDamage - playerDef * 0.5));
        
        // 暗影獵人詛咒傷害
        if (gameState.monster.curseDuration && gameState.monster.curseDuration > 0) {
            const curseDmg = Math.floor(finalDamage * 0.3);
            finalDamage += curseDmg;
            addLog('💀 詛咒！敵人受到額外 ' + curseDmg + ' 點傷害！');
            gameState.monster.curseDuration--;
        }
        
        gameState.player.hp = Math.max(0, gameState.player.hp - finalDamage);
        
        addLog(gameState.monster.name + ' 使用【' + skill.name + '】，造成 ' + finalDamage + ' 點傷害！');
        createDamageNumber(finalDamage, Math.random() * 400 + 100, Math.random() * 300 + 100);
        
        // 龍騎士反射傷害
        if (gameState.player.name === '龍騎士' && gameState.player.reflectActive) {
            const reflectDmg = Math.floor(finalDamage * 0.3);
            gameState.monster.hp = Math.max(0, gameState.monster.hp - reflectDmg);
            addLog('🔄 龍鱗反射！反傷 ' + reflectDmg + ' 點！');
            gameState.player.reflectActive = false;
        }
        
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
    const baseReward = 50 + gameState.currentStage * 15;
    const bonusReward = gameState.monster.isElite ? Math.floor(baseReward * 1.3) : 0;
    gameState.player.xp += baseReward + bonusReward;
    
    let msg = '<p>你擊敗了 ' + gameState.monster.name + '！</p><p>獲得 ' + (baseReward + bonusReward) + ' XP</p>';
    
    if (gameState.player.xp >= gameState.player.xpToNext) {
        gameState.player.level++;
        gameState.player.xpToNext = Math.floor(gameState.player.xpToNext * 1.15);
        gameState.player.maxHp += 12;
        gameState.player.hp = Math.min(gameState.player.hp + 25, gameState.player.maxHp);
        gameState.player.atk += 3;
        gameState.player.def += 1;
        msg += '<p>⭐ 升級到 Lv.' + gameState.player.level + '！ HP +12, ATK +3, DEF +1</p>';
    }
    
    // Boss 掉落
    if (gameState.monster.isBoss) {
        const bonus = 3 + gameState.currentStage * 1.5;
        gameState.player.atk += bonus;
        msg += '<p>🎁 Boss掉落：攻擊力 +' + Math.round(bonus) + '</p>';
        
        // 掉落裝備
        const dropWeapon = WEAPONS[Math.min(gameState.currentStage, WEAPONS.length - 1)];
        const dropArmor = ARMOR[Math.min(gameState.currentStage, ARMOR.length - 1)];
        gameState.inventory.weapons.push(dropWeapon);
        gameState.inventory.armor.push(dropArmor);
        gameState.inventory.money += 100;
        msg += '<p>📦 獲得：' + dropWeapon.name + ' 與 ' + dropArmor.name + '，金錢 +100</p>';
    } else if (gameState.monster.isElite) {
        const bonus = 2 + gameState.currentStage;
        gameState.player.atk += bonus;
        msg += '<p>✨ 精英怪掉落：攻擊力 +' + bonus + '</p>';
        gameState.inventory.money += 80;
        gameState.inventory.consumables.push({ ...CONSUMABLES[1], quantity: 1 });
        msg += '<p>💊 獲得：中血瓶 ×1，金錢 +80</p>';
    } else {
        gameState.inventory.money += 30;
    }
    
    document.getElementById('resultDetails').innerHTML = msg;
    
    if (gameState.monster.isBoss) {
        document.getElementById('nextBtn').textContent = gameState.currentStage >= 5 ? '🏆 查看通關結果' : '進入休息區域';
    } else {
        document.getElementById('nextBtn').textContent = '繼續戰鬥';
    }
    
    showScreen('resultScreen');
}

function nextBattle() {
    if (gameState.bossFightActive) {
        if (gameState.currentStage >= 5) {
            const stats = '<p>🏆 恭喜通關所有 5 關！</p><p>角色：' + gameState.player.name + '</p><p>最終等級：Lv.' + gameState.player.level + '</p><p>最終攻擊力：' + Math.round(gameState.player.atk) + '</p><p>最終 HP：' + gameState.player.maxHp + '</p><p>最終防禦：' + gameState.player.def + '</p>';
            document.getElementById('finalStats').innerHTML = stats;
            showScreen('completeScreen');
            return;
        }
        // 進入休息區域
        enterRestArea();
    } else {
        startNextBattle();
    }
}

function enterRestArea() {
    gameState.inRestArea = true;
    updateRestAreaUI();
    showScreen('restAreaScreen');
}

function updateRestAreaUI() {
    // 更新背包顯示
    let weaponHTML = '<h4>武器</h4>';
    gameState.inventory.weapons.forEach((w, idx) => {
        const isEquipped = gameState.equipped.weapon && gameState.equipped.weapon.id === w.id ? '✓ ' : '';
        weaponHTML += '<button class="item-btn" onclick="equipWeapon(' + idx + ')">' + isEquipped + w.name + ' (ATK+' + w.atk + ')</button>';
    });
    document.getElementById('weaponList').innerHTML = weaponHTML;
    
    let armorHTML = '<h4>防具</h4>';
    gameState.inventory.armor.forEach((a, idx) => {
        const isEquipped = gameState.equipped.armor && gameState.equipped.armor.id === a.id ? '✓ ' : '';
        armorHTML += '<button class="item-btn" onclick="equipArmor(' + idx + ')">' + isEquipped + a.name + ' (DEF+' + a.def + ')</button>';
    });
    document.getElementById('armorList').innerHTML = armorHTML;
    
    // 更新消耗品顯示
    let consumableHTML = '<h4>消耗品</h4>';
    gameState.inventory.consumables.forEach((c, idx) => {
        const healText = c.heal === 'full' ? '完全恢復' : '恢復' + c.heal;
        consumableHTML += '<button class="item-btn" onclick="useConsumable(' + idx + ')">x' + c.quantity + ' ' + c.name + ' (' + healText + ')</button>';
    });
    document.getElementById('consumableList').innerHTML = consumableHTML;
    
    // 顯示統計信息
    let passive = gameState.player.passive ? '<p>⭐ 被動技能：' + gameState.player.passive.name + ' - ' + gameState.player.passive.desc + '</p>' : '';
    document.getElementById('restStats').innerHTML = 
        '<p>❤️ HP: ' + gameState.player.hp + '/' + gameState.player.maxHp + '</p>' +
        '<p>💪 ATK: ' + Math.round(gameState.player.atk) + '</p>' +
        '<p>🛡️ DEF: ' + (gameState.player.def + (gameState.equipped.armor ? gameState.equipped.armor.def : 0)) + '</p>' +
        '<p>💰 金錢: ' + gameState.inventory.money + '</p>' +
        passive;
}

function equipWeapon(idx) {
    gameState.equipped.weapon = gameState.inventory.weapons[idx];
    addLog('✅ 裝備了 ' + gameState.equipped.weapon.name);
    updateRestAreaUI();
}

function equipArmor(idx) {
    gameState.equipped.armor = gameState.inventory.armor[idx];
    addLog('✅ 裝備了 ' + gameState.equipped.armor.name);
    updateRestAreaUI();
}

function useConsumable(idx) {
    const consumable = gameState.inventory.consumables[idx];
    if (consumable.quantity <= 0) return;
    
    const healAmount = consumable.heal === 'full' ? gameState.player.maxHp - gameState.player.hp : consumable.heal;
    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
    
    addLog('💊 使用了 ' + consumable.name + '，恢復 ' + healAmount + ' HP');
    
    consumable.quantity--;
    if (consumable.quantity <= 0) {
        gameState.inventory.consumables.splice(idx, 1);
    }
    updateRestAreaUI();
}

function restoreHPRest() {
    const restoreAmount = Math.floor(gameState.player.maxHp * 0.5);
    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + restoreAmount);
    addLog('😴 在休息區域中恢復了 ' + restoreAmount + ' HP');
    updateRestAreaUI();
}

function continueToNextStage() {
    gameState.inRestArea = false;
    gameState.currentStage++;
    startStage();
}

function gameOver() {
    const stats = '<p>到達階段：第 ' + gameState.currentStage + ' 關</p><p>選擇角色：' + gameState.player.name + '</p><p>擊敗對手數：' + gameState.defeatedInStage + '</p><p>最終等級：Lv.' + gameState.player.level + '</p><p>最終攻擊力：' + Math.round(gameState.player.atk) + '</p><p>最終防禦：' + gameState.player.def + '</p>';
    document.getElementById('gameOverStats').innerHTML = stats;
    showScreen('gameOverScreen');
}

function restartGame() {
    gameState = {
        player: null, monster: null, currentStage: 1, currentMonsterIndex: 0,
        totalMonstersInStage: 0, inBattle: false, actionInProgress: false,
        bossFightActive: false, eliteFightActive: false, defeatedInStage: 0,
        inRestArea: false,
        inventory: { weapons: [], armor: [], consumables: [], money: 300 },
        equipped: { weapon: null, armor: null }
    };
    document.querySelectorAll('.card').forEach(c => c.style.opacity = '1');
    showScreen('selectionScreen');
}

document.addEventListener('DOMContentLoaded', () => showScreen('selectionScreen'));
