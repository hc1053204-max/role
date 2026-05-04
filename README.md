<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 20mm;
            background-color: #ffffff;
        }
        body {
            font-family: 'PingFang TC', 'Microsoft JhengHei', sans-serif;
            line-height: 1.6;
            color: #24292e;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 10px;
        }
        header {
            border-bottom: 2px solid #e1e4e8;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        h1 {
            color: #0366d6;
            font-size: 24pt;
            margin: 0;
        }
        h2 {
            font-size: 16pt;
            border-left: 5px solid #28a745;
            padding-left: 10px;
            margin-top: 30px;
            color: #24292e;
        }
        .summary-box {
            background-color: #f6f8fa;
            border: 1px solid #d1d5da;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .summary-box ul {
            margin: 0;
            padding-left: 20px;
        }
        .code-block {
            background-color: #282c34;
            color: #abb2bf;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 10pt;
            white-space: pre-wrap;
            margin: 15px 0;
            position: relative;
        }
        .file-label {
            display: inline-block;
            background: #444;
            color: #fff;
            padding: 2px 8px;
            font-size: 9pt;
            border-radius: 4px;
            margin-bottom: 5px;
        }
        .tag {
            font-weight: bold;
            color: #d73a49;
        }
        footer {
            margin-top: 50px;
            font-size: 9pt;
            color: #6a737d;
            text-align: center;
            border-top: 1px solid #e1e4e8;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>C++ 冒險遊戲 - GitHub 項目優化指南</h1>
            <p>基於 Copilot 代碼審查建議的重構成果</p>
        </header>

        <div class="summary-box">
            <h2>重構亮點摘要</h2>
            <ul>
                <li><span class="tag">記憶體安全：</span> 全面引入 <code>std::unique_ptr</code>，消除 <code>new/delete</code> 帶來的洩漏風險。</li>
                <li><span class="tag">強健性提升：</span> 增加輸入驗證 (Input Validation) 與目標存活檢查。</li>
                <li><span class="tag">架構優化：</span> 遵循 OOP 封裝原則，優化標頭檔依賴與多型設計。</li>
                <li><span class="tag">遊戲平衡：</span> 重構升級機制，避免過度回復影響挑戰性。</li>
            </ul>
        </div>

        <h2>1. 主程式入口優化 (main.cpp)</h2>
        <p>移除了手動記憶體釋放，並加入了強制的職業選擇驗證。</p>
        <div class="code-block">
<span class="file-label">main.cpp</span>
#include &lt;memory&gt;
#include "Warrior.h"
#include "Mage.h"
#include "Archer.h"
#include "GameManager.h"

int main() {
    srand((unsigned)time(nullptr));
    int choice;
    
    // 使用 do-while 確保有效輸入
    do {
        std::cout << "選擇職業:(1)戰士 (2)法師 (3)射手: ";
        std::cin >> choice;
    } while (choice < 1 || choice > 3);

    std::unique_ptr&lt;Role&gt; hero;
    if (choice == 1) hero = std::make_unique&lt;Warrior&gt;("戰士");
    else if (choice == 2) hero = std::make_unique&lt;Mage&gt;("法師");
    else hero = std::make_unique&lt;Archer&gt;("射手");

    GameManager gm;
    // 遊戲邏輯啟動...
    return 0;
}
        </div>

        <h2>2. 基類介面定義 (Role.h)</h2>
        <p>修正了析構函數的安全性，並擴充了戰鬥系統所需的 Getter 方法。</p>
        <div class="code-block">
<span class="file-label">Role.h</span>
#ifndef ROLE_H
#define ROLE_H
#include &lt;string&gt;

class Role {
protected:
    std::string name;
    int hp, maxHp, atk;
    int level, xp, xpToNext;
public:
    Role(std::string n, int h, int a);
    virtual ~Role() {} // 虛擬析構函數確保多型安全釋放
    
    virtual void useSkill(Role& target, int skillId) = 0;
    void attack(Role& target);
    void takeDamage(int damage);
    bool isAlive() const;
    
    // Getter 方法
    std::string getName() const;
    int getHp() const;
    int getMaxHp() const;
    void gainXp(int amount);
};
#endif
        </div>

        <h2>3. 職業技能邏輯 (以 Mage.cpp 為例)</h2>
        <p>加入了對目標狀態的防禦性檢查，防止對已死亡目標施法。</p>
        <div class="code-block">
<span class="file-label">Mage.cpp</span>
#include "Mage.h"

Mage::Mage(std::string n) : Role(n, 80, 40) {}

void Mage::useSkill(Role& target, int skillId) {
    if (!target.isAlive()) {
        std::cout << "[系統] 目標已死亡，無法施法！" << std::endl;
        return;
    }

    if (skillId == 1) {
        std::cout << "[法師] " << name << " 施放 火球術！" << std::endl;
        target.takeDamage(atk + 20);
    } 
    // ... 其他技能分支
}
        </div>

        <footer>
            <p>GitHub Repository: hc1053204-max/CppAdventureGame</p>
            <p>最後更新日期：2026年5月4日</p>
        </footer>
    </div>
</body>
</html>
