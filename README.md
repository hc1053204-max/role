<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C++ 冒險遊戲 - 代碼優化成果</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 1000px; margin: 0 auto; padding: 20px; background-color: #f4f7f6; }
        header { background: #2c3e50; color: white; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: center; }
        h2 { border-left: 5px solid #27ae60; padding-left: 10px; color: #2c3e50; }
        .summary { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .code-container { background: #282c34; color: #abb2bf; padding: 15px; border-radius: 8px; overflow-x: auto; margin-bottom: 2rem; position: relative; }
        pre { margin: 0; font-family: 'Consolas', 'Monaco', monospace; }
        .file-name { position: absolute; top: 0; right: 0; background: #444; color: #eee; padding: 2px 10px; font-size: 0.8rem; border-bottom-left-radius: 5px; }
        .keyword { color: #c678dd; }
        .comment { color: #5c6370; font-style: italic; }
        .string { color: #98c379; }
        footer { text-align: center; margin-top: 3rem; color: #777; font-size: 0.9rem; }
        .highlight-box { border: 1px solid #e0e0e0; background: #fff; padding: 15px; margin-bottom: 10px; border-radius: 5px; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-right: 5px; }
        .tag-fix { background: #e74c3c; color: white; }
        .tag-improve { background: #3498db; color: white; }
    </style>
</head>
<body>

<header>
    <h1>C++ 冒險遊戲代碼優化總結</h1>
    <p>基於與 GitHub Copilot 的代碼審查與討論</p>
</header>

<section class="summary">
    <h2>核心改進重點</h2>
    <div class="highlight-box">
        <span class="tag tag-fix">重要</span> <strong>記憶體管理：</strong> 使用 <code>std::unique_ptr</code> 替代原始指標，解決潛在的記憶體洩漏問題。
    </div>
    <div class="highlight-box">
        <span class="tag tag-fix">重要</span> <strong>輸入驗證：</strong> 為職業選擇與戰鬥動作加入 <code>while</code> 迴圈檢查，防止無效輸入導致崩潰。
    </div>
    <div class="highlight-box">
        <span class="tag tag-improve">設計</span> <strong>封裝與多型：</strong> 修正標頭檔的 <code>include guard</code>，並將 UI 更新方法 <code>showHTMLUpdate</code> 設為私有。
    </div>
    <div class="highlight-box">
        <span class="tag tag-improve">邏輯</span> <strong>遊戲平衡：</strong> 修正升級立即滿血的邏輯，改為回復部分血量，並增加目標存活檢查。
    </div>
</section>

<h2>1. 主程式與遊戲循環</h2>
<div class="code-container">
    <div class="file-name">main.cpp</div>
    <pre>
#include &lt;memory&gt;
#include "Warrior.h"
#include "Mage.h"
#include "Archer.h"
#include "GameManager.h"

int main() {
    srand((unsigned)time(nullptr));
    int choice;
    
    // 職業選擇與驗證
    do {
        cout << "選擇職業:(1)戰士 (2)法師 (3)射手: ";
        cin >> choice;
    } while (choice < 1 || choice > 3);

    unique_ptr&lt;Role&gt; hero;
    if (choice == 1) hero = make_unique&lt;Warrior&gt;("戰士");
    else if (choice == 2) hero = make_unique&lt;Mage&gt;("法師");
    else hero = make_unique&lt;Archer&gt;("射手");

    GameManager gm;
    // ... 遊戲迴圈 (省略重複部分) ...
    return 0;
}</pre>
</div>

<h2>2. 角色基類 (Role)</h2>
<div class="code-container">
    <div class="file-name">Role.h</div>
    <pre>
#ifndef ROLE_H
#define ROLE_H
#include &lt;string&gt;
#include &lt;iostream&gt;
using namespace std;

class Role {
protected:
    string name;
    int hp, maxHp, atk;
    int level, xp, xpToNext;
public:
    Role(string n, int h, int a);
    virtual ~Role() {}
    virtual void useSkill(Role& target, int skillId) = 0;
    void attack(Role& target);
    void takeDamage(int damage);
    bool isAlive() const;
    string getName() const;
    int getHp() const;
    int getMaxHp() const;
    void gainXp(int amount);
    void addAtk(int amount);
};
#endif</pre>
</div>

<h2>3. 職業實現 (以 Mage 為例)</h2>
<div class="code-container">
    <div class="file-name">Mage.cpp</div>
    <pre>
#include "Mage.h"

Mage::Mage(string n) : Role(n, 80, 40) {}

void Mage::useSkill(Role& target, int skillId) {
    if (!target.isAlive()) return;

    if (skillId == 1) {
        cout << "[Mage] casts Fireball!" << endl;
        target.takeDamage(atk + 20);
    } else if (skillId == 2) {
        cout << "[Mage] casts Ice Lance!" << endl;
        target.takeDamage(atk + 10);
    } else if (skillId == 3) {
        cout << "[Mage] casts Arcane Burst!" << endl;
        target.takeDamage(atk + 35);
    } else {
        cout << "Unknown skill!" << endl;
    }
}</pre>
</div>

<h2>4. 遊戲管理者 (GameManager)</h2>
<div class="code-container">
    <div class="file-name">GameManager.cpp</div>
    <pre>
#include "GameManager.h"

bool GameManager::battle(Role& player, Role& monster) {
    while (player.isAlive() && monster.isAlive()) {
        showHTMLUpdate(player, monster);
        int action;
        cout << "選擇動作: (1)攻擊 (2)技能 > ";
        cin >> action;

        if (action == 1) player.attack(monster);
        else {
            int sid;
            cout << "選擇技能 (1-3) > ";
            cin >> sid;
            player.useSkill(monster, sid);
        }

        if (monster.isAlive()) {
            int mskill = (rand() % 3) + 1;
            monster.useSkill(player, mskill);
        }
    }
    return player.isAlive();
}</pre>
</div>

<footer>
    <p>完成日期：2026年5月4日 | 由 Gemini 根據 Copilot 對話紀錄整理</p>
</footer>

</body>
</html>
