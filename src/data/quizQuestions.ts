// Quiz questions data for course post-tests
// Each course has 19-20 questions with 4 options (A-D)

export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface CourseQuiz {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  url: string;
  questions: QuizQuestion[];
  pointsPerQuestion: number;
  totalPoints: number;
}

// 設計流程（入門）- 20 題
const beginnerQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '課程強調「精準表達」的重要性，主要是指什麼？',
    options: [
      { key: 'A', text: '使用專業術語溝通' },
      { key: 'B', text: '把腦中的想法清楚地說出來，讓 AI 能理解你真正想要什麼' },
      { key: 'C', text: '撰寫完美的程式碼' },
      { key: 'D', text: '背誦固定的對話模板' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 2,
    question: '課程中提到的「Vibe Coding」是什麼概念？',
    options: [
      { key: 'A', text: '把你腦中想的東西，直接透過對話變成實際可用的工具' },
      { key: 'B', text: '嚴格遵守程式語法規則' },
      { key: 'C', text: '必須先學會寫程式碼' },
      { key: 'D', text: '只能用於遊戲開發' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 3,
    question: '課程中提到的「設計之美」，真正的意義是什麼？',
    options: [
      { key: 'A', text: '只追求外觀的美化' },
      { key: 'B', text: '使用複雜的設計工具' },
      { key: 'C', text: '設計出來的東西不只要好看，更要讓人用起來很自然、很順手' },
      { key: 'D', text: '模仿其他產品的設計' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 4,
    question: '課程說的「從所思所想，到所求所見，再至所用所得」是什麼意思？',
    options: [
      { key: 'A', text: '從想法開始，到實際做出來，最後真的能用——這是完整的學習過程' },
      { key: 'B', text: '從購買到使用的流程' },
      { key: 'C', text: '從設計到測試的流程' },
      { key: 'D', text: '從規劃到放棄的流程' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 5,
    question: '「應用之道｜何處用 AI？」這個單元的核心問題是？',
    options: [
      { key: 'A', text: 'AI 可以用在哪些軟體上' },
      { key: 'B', text: 'AI 的價格是多少' },
      { key: 'C', text: '辨識工作中 AI 可介入的場景與時機' },
      { key: 'D', text: 'AI 的運算速度' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 6,
    question: '課程中提到判斷「何時該引入 AI 協作」的關鍵是什麼？',
    options: [
      { key: 'A', text: '看公司預算是否充足' },
      { key: 'B', text: '跟隨流行趨勢' },
      { key: 'C', text: '等待主管指示' },
      { key: 'D', text: '判斷任務性質，決定 AI 協作的必要性' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 7,
    question: '在決定是否引入 AI 時，應該避免的態度是？',
    options: [
      { key: 'A', text: '謹慎評估任務需求' },
      { key: 'B', text: '盲目跟風，所有工作都要用 AI' },
      { key: 'C', text: '考慮成本效益' },
      { key: 'D', text: '評估團隊能力' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    question: '課程說的「與 AI 共事」，核心概念是什麼？',
    options: [
      { key: 'A', text: '學習 AI 的程式語言' },
      { key: 'B', text: '完全依賴 AI 完成工作' },
      { key: 'C', text: '把 AI 融入你的工作方式，想事情的時候就把 AI 的能力考慮進去' },
      { key: 'D', text: '不改變現有工作方式' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 9,
    question: '課程說的「如何構思所需」，重點是什麼能力？',
    options: [
      { key: 'A', text: '撰寫詳細的技術文件' },
      { key: 'B', text: '快速完成任務' },
      { key: 'C', text: '使用固定模板' },
      { key: 'D', text: '把模糊的想法一步步變清楚：先定目標、再拆解步驟、最後搞清楚真正需要什麼' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 10,
    question: '有效提問最重要的是什麼？',
    options: [
      { key: 'A', text: '問題越長越好' },
      { key: 'B', text: '使用模糊的描述' },
      { key: 'C', text: '問得好不好，決定答案好不好——好的提問是一門藝術' },
      { key: 'D', text: '避免提供背景資訊' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 11,
    question: '課程說的「逆向工程拆解術」是什麼方法？',
    options: [
      { key: 'A', text: '從頭開始設計流程' },
      { key: 'B', text: '看到好的成果，反過來想它是怎麼做出來的' },
      { key: 'C', text: '複製現有流程' },
      { key: 'D', text: '忽略流程設計' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 12,
    question: 'Vibe Coding 跟傳統寫程式最大的不同是什麼？',
    options: [
      { key: 'A', text: '使用的程式語言不同' },
      { key: 'B', text: '執行速度更快' },
      { key: 'C', text: '不用當程式高手，用自然的方式說出需求，讓 AI 幫你實現' },
      { key: 'D', text: '成本更低' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 13,
    question: '在規劃階段，怎麼有效地把想法變成實際的東西？',
    options: [
      { key: 'A', text: '直接開始執行' },
      { key: 'B', text: '像畫設計圖一樣，把想法一步步變成清楚的計畫，從空想家變成實踐者' },
      { key: 'C', text: '等待靈感降臨' },
      { key: 'D', text: '模仿他人做法' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 14,
    question: '當你腦中的想法很難用語言說清楚時，最好的做法是？',
    options: [
      { key: 'A', text: '放棄這個想法，改用簡單的需求' },
      { key: 'B', text: '直接要求 AI 猜測你的意圖' },
      { key: 'C', text: '使用專業術語堆砌以顯得專業' },
      { key: 'D', text: '用圖片參考、打比方、分段說明等方式，一步步把模糊的想法變成能溝通的內容' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 15,
    question: '課程提到的「建築師思維」在實踐時，最關鍵的能力是什麼？',
    options: [
      { key: 'A', text: '快速執行而不思考' },
      { key: 'B', text: '在「理想畫面」和「實現方法」之間搭起橋樑，搞清楚每一步的因果關係' },
      { key: 'C', text: '完全依賴 AI 的建議' },
      { key: 'D', text: '追求最炫酷的技術' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 16,
    question: '在和 AI 協作時，你應該怎麼定位自己？',
    options: [
      { key: 'A', text: '完全聽從 AI 的建議' },
      { key: 'B', text: '做事時用 AI 提高效率，檢查時用 AI 看得更全面' },
      { key: 'C', text: '只讓 AI 做簡單工作' },
      { key: 'D', text: '避免使用 AI' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 17,
    question: '從「模糊想法」到「清楚計畫」，最常遇到什麼困難？怎麼解決？',
    options: [
      { key: 'A', text: '技術能力不足；解法：學習所有技術' },
      { key: 'B', text: '不知道怎麼把大目標拆成小步驟；解法：從終點往回推，並用 AI 幫忙理清邏輯' },
      { key: 'C', text: '時間不夠；解法：加班' },
      { key: 'D', text: '工具太複雜；解法：放棄使用工具' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 18,
    question: '用「逆向工程」拆解一個好成果，正確的順序是什麼？',
    options: [
      { key: 'A', text: '成果 → 工具 → 技術 → 目標' },
      { key: 'B', text: '成果 → 模仿 → 完成' },
      { key: 'C', text: '成果 → 想想目標是什麼 → 設計邏輯 → 重要決定 → 執行步驟 → 選工具' },
      { key: 'D', text: '成果 → 技術分析 → 直接複製' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 19,
    question: '「Vibe Coding」跟傳統寫程式，最大的思維轉變是什麼？',
    options: [
      { key: 'A', text: '使用的程式語言不同' },
      { key: 'B', text: '從「技術為主」變成「想法為主」，從「語法對不對」變成「能不能實現想法」' },
      { key: 'C', text: '開發速度更快' },
      { key: 'D', text: '不需要測試' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 20,
    question: '為什麼課程說「一日洞見，終身受用」？',
    options: [
      { key: 'A', text: '課程只需要上一天' },
      { key: 'B', text: '學習內容很簡單' },
      { key: 'C', text: '不需要持續練習' },
      { key: 'D', text: '這一天學到的核心觀念和方法，可以讓你一輩子都受用' },
    ],
    correctAnswer: 'D',
  },
];

// 工作流程（基礎）- 20 題
const basicQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '課程中「如水之形，隨器而變」比喻工作流程的什麼特性？',
    options: [
      { key: 'A', text: '流程必須固定不變' },
      { key: 'B', text: '流程只能用於特定情況' },
      { key: 'C', text: '流程應該可塑、可調整，隨需求而改變' },
      { key: 'D', text: '流程越複雜越好' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 2,
    question: '工作流程的「可重複性」在實務上最重要的價值是什麼？',
    options: [
      { key: 'A', text: '讓工作看起來專業' },
      { key: 'B', text: '確保同樣的輸入每次都能得到一致的結果，減少人為錯誤' },
      { key: 'C', text: '增加工作時間' },
      { key: 'D', text: '讓流程更複雜' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    question: '「模組化」設計在處理複雜流程時，最大的優勢是？',
    options: [
      { key: 'A', text: '讓流程看起來更漂亮' },
      { key: 'B', text: '增加開發時間' },
      { key: 'C', text: '讓流程無法修改' },
      { key: 'D', text: '將大流程拆成小模組，每個模組獨立測試和維護，降低錯誤率' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 4,
    question: '課程強調「可視化」設計，主要是為了？',
    options: [
      { key: 'A', text: '讓流程邏輯一目了然，降低理解和溝通成本' },
      { key: 'B', text: '只是為了美觀' },
      { key: 'C', text: '增加檔案大小' },
      { key: 'D', text: '讓初學者更困惑' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 5,
    question: '「透過模組化設計實現可重複的穩定流程」，實際應用時最重要的是？',
    options: [
      { key: 'A', text: '每個模組都要很大' },
      { key: 'B', text: '每個模組功能單一明確，可以獨立運作和重複使用' },
      { key: 'C', text: '模組之間完全不能溝通' },
      { key: 'D', text: '模組越多越好' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 6,
    question: 'Make.com 最適合用於什麼類型的任務？',
    options: [
      { key: 'A', text: '只能處理郵件' },
      { key: 'B', text: '只能做簡單計算' },
      { key: 'C', text: '圖片編輯' },
      { key: 'D', text: '企業級自動化工作流程，可視覺化設計並整合多種服務' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 7,
    question: '在選擇自動化工具時，最應該考慮的因素是？',
    options: [
      { key: 'A', text: '工具的品牌知名度' },
      { key: 'B', text: '任務的複雜度、整合需求、團隊技術能力和預算' },
      { key: 'C', text: '工具的介面顏色' },
      { key: 'D', text: '朋友推薦什麼' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    question: '自動化流程設計的第一步「需求分析」，最重要的是？',
    options: [
      { key: 'A', text: '明確自動化目標，識別哪些是重複性、可自動化的任務' },
      { key: 'B', text: '馬上選擇工具' },
      { key: 'C', text: '開始畫流程圖' },
      { key: 'D', text: '找最貴的工具' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 9,
    question: '「流程設計」階段應該做什麼？',
    options: [
      { key: 'A', text: '直接開始設定工具' },
      { key: 'B', text: '只想一個大概' },
      { key: 'C', text: '繪製流程圖，定義輸入、處理、輸出的完整邏輯' },
      { key: 'D', text: '交給別人做' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 10,
    question: '「參數定義」階段為什麼重要？',
    options: [
      { key: 'A', text: '只是形式上的要求' },
      { key: 'B', text: '讓流程變複雜' },
      { key: 'C', text: '沒有必要' },
      { key: 'D', text: '建立變數模組，確保每次執行時資料格式一致，避免錯誤' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 11,
    question: '「Bridge 超鏈習：企業與個人整合的編碼」強調什麼？',
    options: [
      { key: 'A', text: '打通企業系統與個人工具，實現無縫的整合自動化' },
      { key: 'B', text: '企業和個人系統無法連接' },
      { key: 'C', text: '只適合大企業' },
      { key: 'D', text: '只處理個人任務' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 12,
    question: '「Agent 設計：AI 驅動的智能代理」是指？',
    options: [
      { key: 'A', text: '只是一個名詞' },
      { key: 'B', text: '設計能自主判斷和執行任務的 AI 代理，讓自動化更智能' },
      { key: 'C', text: '與自動化無關' },
      { key: 'D', text: '只能處理文字' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 13,
    question: '「MCP（Model Context Protocol）」在 AI 自動化中的作用是？',
    options: [
      { key: 'A', text: '加快運算速度' },
      { key: 'B', text: '儲存檔案' },
      { key: 'C', text: '主動管理 AI 對話的上下文，讓 AI 更理解使用者意圖' },
      { key: 'D', text: '發送郵件' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 14,
    question: '課程的最終目標「建立可重複執行的標準化流程」，在企業應用中最重要的價值是？',
    options: [
      { key: 'A', text: '讓報表好看' },
      { key: 'B', text: '增加工作量' },
      { key: 'C', text: '炫耀技術' },
      { key: 'D', text: '提升效率、降低錯誤、讓團隊專注於更有價值的工作' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 15,
    question: '如果一個任務「每天固定時間發送相同格式的報表」，這應該屬於？',
    options: [
      { key: 'A', text: '典型的自動化場景，可用定時觸發 + 固定流程' },
      { key: 'B', text: '不需要自動化' },
      { key: 'C', text: '太複雜無法自動化' },
      { key: 'D', text: '需要 AI 才能處理' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 16,
    question: '在設計自動化流程時，遇到「有時需要路徑 A，有時需要路徑 B」，應該用什麼？',
    options: [
      { key: 'A', text: '建立兩個獨立流程' },
      { key: 'B', text: '用 Router 根據條件自動選擇路徑' },
      { key: 'C', text: '手動切換' },
      { key: 'D', text: '放棄自動化' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 17,
    question: '如果要處理「100 筆訂單資料，逐筆發送通知」，應該用什麼模組？',
    options: [
      { key: 'A', text: '手動一筆一筆處理' },
      { key: 'B', text: '只處理第一筆' },
      { key: 'C', text: 'Iterator 將陣列逐筆拆解處理' },
      { key: 'D', text: '全部一次處理' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 18,
    question: '在流程執行過程中想要「暫存中間結果供後續使用」，應該用？',
    options: [
      { key: 'A', text: '寫在紙上' },
      { key: 'B', text: '重新執行一次' },
      { key: 'C', text: '不需要暫存' },
      { key: 'D', text: 'Set Variable 設定變數' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 19,
    question: '當你想要「多筆資料匯總成一筆」時，應該用什麼模組？',
    options: [
      { key: 'A', text: 'Aggregator' },
      { key: 'B', text: 'Iterator' },
      { key: 'C', text: 'Router' },
      { key: 'D', text: 'Webhook' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 20,
    question: '學完這門課後，你應該具備什麼能力？',
    options: [
      { key: 'A', text: '成為程式設計專家' },
      { key: 'B', text: '只會操作介面' },
      { key: 'C', text: '完全依賴別人' },
      { key: 'D', text: '能夠分析需求、設計流程、實現可重複的自動化方案' },
    ],
    correctAnswer: 'D',
  },
];

// 思維流程（中階）- 20 題
const intermediateQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'AI Agent 與傳統 Chatbot 最本質的差異是什麼？',
    options: [
      { key: 'A', text: 'AI Agent 只能回答預設問題' },
      { key: 'B', text: '傳統 Chatbot 比較聰明' },
      { key: 'C', text: 'AI Agent 能處理資訊並主動執行指令，而非只是對話回應' },
      { key: 'D', text: '兩者完全相同' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 2,
    question: '課程中「如風之意，因勢而導」比喻思維流程的什麼特性？',
    options: [
      { key: 'A', text: '流程必須固定不變' },
      { key: 'B', text: '變數需要識別、理解與應對，根據情境靈活調整' },
      { key: 'C', text: '完全隨機執行' },
      { key: 'D', text: '不需要考慮任何變數' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    question: 'Agent 在「變數不明的情況下建立邏輯決策」是指？',
    options: [
      { key: 'A', text: '透過語意理解和推理，即使資訊不完整也能做出合理判斷' },
      { key: 'B', text: '完全無法處理未知狀況' },
      { key: 'C', text: '只能處理預設情況' },
      { key: 'D', text: '需要人工介入每個決策' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 4,
    question: '課程中提到，企業常見的問題之一是？',
    options: [
      { key: 'A', text: '資訊過少' },
      { key: 'B', text: '流程過度自動化' },
      { key: 'C', text: '完全依賴 AI' },
      { key: 'D', text: '知識無法有效運用' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 5,
    question: '讓 AI Agent 正確回答公司問題最重要的是？',
    options: [
      { key: 'A', text: '網路速度' },
      { key: 'B', text: '提供正確且結構化的知識庫內容' },
      { key: 'C', text: '使用高階硬體設備' },
      { key: 'D', text: '載入圖片訓練模型' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 6,
    question: 'RAG（Retrieval-Augmented Generation）的核心功能是？',
    options: [
      { key: 'A', text: '向量資料庫語義檢索，讓 AI 基於相關資料生成回答' },
      { key: 'B', text: '加快網路速度' },
      { key: 'C', text: '儲存圖片' },
      { key: 'D', text: '發送郵件' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 7,
    question: '在 RAG 系統中，「向量檢索」的作用是？',
    options: [
      { key: 'A', text: '隨機選擇資料' },
      { key: 'B', text: '只處理數字' },
      { key: 'C', text: '語義相似度計算，找出最相關的資訊' },
      { key: 'D', text: '儲存檔案' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 8,
    question: '「降低模型幻覺問題」是指什麼？',
    options: [
      { key: 'A', text: '讓 AI 更有創意' },
      { key: 'B', text: '增加回答速度' },
      { key: 'C', text: '改變 AI 個性' },
      { key: 'D', text: '透過提供準確資料，減少 AI 編造不存在的資訊' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 9,
    question: 'ReRank（重新排序優化）的主要目的是？',
    options: [
      { key: 'A', text: '打亂資料順序' },
      { key: 'B', text: '語義相關性重新評分，提升檢索精準度' },
      { key: 'C', text: '刪除資料' },
      { key: 'D', text: '加密資訊' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 10,
    question: '「Top-K 結果優化」是指？',
    options: [
      { key: 'A', text: '只選擇最舊的資料' },
      { key: 'B', text: '隨機選擇' },
      { key: 'C', text: '從多個結果中篩選出最相關的 K 筆資料' },
      { key: 'D', text: '刪除所有結果' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 11,
    question: 'ReAct 思維模式代表什麼？',
    options: [
      { key: 'A', text: 'Reasoning + Acting（推理 + 行動）' },
      { key: 'B', text: 'Reset + Action' },
      { key: 'C', text: 'Remove + Active' },
      { key: 'D', text: 'Repeat + Actual' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 12,
    question: 'ReAct 的「思考（Thought）」階段是做什麼？',
    options: [
      { key: 'A', text: '直接執行任務' },
      { key: 'B', text: '儲存資料' },
      { key: 'C', text: '發送通知' },
      { key: 'D', text: '分析當前狀態，規劃下一步行動' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 13,
    question: 'ReAct 的「觀察（Observation）」階段是做什麼？',
    options: [
      { key: 'A', text: '忽略結果' },
      { key: 'B', text: '接收行動結果，評估資訊充分性' },
      { key: 'C', text: '重新開始' },
      { key: 'D', text: '關閉系統' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 14,
    question: 'ReAct 思維模式透過「初步檢索、Top-K 設定、Reranking」形成什麼？',
    options: [
      { key: 'A', text: '隨機結果' },
      { key: 'B', text: '單向流程' },
      { key: 'C', text: '思考→行動→觀察→再行動的閉環推理過程' },
      { key: 'D', text: '固定答案' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 15,
    question: '以「房產搜尋」為例，哪些屬於「變數型需求」（需要 AI Agent 判斷）？',
    options: [
      { key: 'A', text: '5年內有增值、附近好停車、採光通風好、環境安靜等複雜條件' },
      { key: 'B', text: '只有固定價格' },
      { key: 'C', text: '只有地點' },
      { key: 'D', text: '不需要判斷' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 16,
    question: '「任務指令」在 AI Agent 設計中是什麼角色？',
    options: [
      { key: 'A', text: '問題範本' },
      { key: 'B', text: '語氣設定' },
      { key: 'C', text: '語言能力設定' },
      { key: 'D', text: '行為邏輯指令，告訴 Agent 該做什麼和怎麼做' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 17,
    question: '下列哪項不適合輸入知識庫？',
    options: [
      { key: 'A', text: '產品操作手冊' },
      { key: 'B', text: '公司政策' },
      { key: 'C', text: '客戶個人隱私資訊' },
      { key: 'D', text: 'FAQ' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 18,
    question: 'AI Agent 回答錯誤最常見原因是？',
    options: [
      { key: 'A', text: '沒開啟場景' },
      { key: 'B', text: '知識庫不足或提問不清' },
      { key: 'C', text: 'Make 模組錯誤' },
      { key: 'D', text: '電腦速度慢' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 19,
    question: '哪個知識庫格式最利於 AI 回答？',
    options: [
      { key: 'A', text: '結構化 Markdown 文件' },
      { key: 'B', text: '一段3000字長文' },
      { key: 'C', text: 'PDF 掃描圖' },
      { key: 'D', text: '電話 Excel 表' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 20,
    question: '結合 Dify AI Agent 和 Make 自動化，最核心的價值是什麼？',
    options: [
      { key: 'A', text: '炫耀技術' },
      { key: 'B', text: '增加成本' },
      { key: 'C', text: '讓 AI 不只回答問題，還能自動執行後續任務和流程' },
      { key: 'D', text: '讓系統變複雜' },
    ],
    correctAnswer: 'C',
  },
];

// 互動流程（高階）- 20 題
const advancedQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '課程中「如道之行，順應自然」比喻互動流程的什麼特性？',
    options: [
      { key: 'A', text: '流程必須完全固定' },
      { key: 'B', text: '完全不需要規劃' },
      { key: 'C', text: '接納不確定性，擁抱隨機探索，讓系統自適應調整' },
      { key: 'D', text: '只能處理預設情況' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 2,
    question: '「擁抱不確定」在人機協作中的核心意義是？',
    options: [
      { key: 'A', text: '接納變化本質，將隨機性視為探索空間的一部分' },
      { key: 'B', text: '放棄所有規劃' },
      { key: 'C', text: '讓系統完全隨機' },
      { key: 'D', text: '不需要任何控制' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 3,
    question: '「人機協作」的理想狀態是什麼？',
    options: [
      { key: 'A', text: 'AI 完全取代人類' },
      { key: 'B', text: '人類完全控制 AI' },
      { key: 'C', text: '兩者完全獨立運作' },
      { key: 'D', text: 'AI 的效率與人類的智慧相結合，似陰陽調和、優勢互補共生' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 4,
    question: '「自適應決策收斂」是指什麼？',
    options: [
      { key: 'A', text: '固定不變的決策' },
      { key: 'B', text: '透過反饋逐步縮小搜索空間，提升效率' },
      { key: 'C', text: '隨機選擇結果' },
      { key: 'D', text: '完全依賴人工' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 5,
    question: '「觸發點設計」在人機協作框架中的作用是？',
    options: [
      { key: 'A', text: '讓系統永遠待機' },
      { key: 'B', text: '完全自動化' },
      { key: 'C', text: '定義何時需要人工介入、設定信心度閾值、識別高風險決策點' },
      { key: 'D', text: '隨機觸發' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 6,
    question: 'Vibe Coding（自然語言驅動開發）的核心價值是？',
    options: [
      { key: 'A', text: '自然語言轉代碼藍圖、UI/AI 雙向互動設計、降低技術門檻加速開發' },
      { key: 'B', text: '必須會寫程式' },
      { key: 'C', text: '只能處理簡單任務' },
      { key: 'D', text: '需要專業背景' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 7,
    question: 'Make Grid（自動化全景視覺地圖）最適合用於？',
    options: [
      { key: 'A', text: '只能做簡單流程' },
      { key: 'B', text: '只能單一流程' },
      { key: 'C', text: '不需要視覺化' },
      { key: 'D', text: '管理大規模自動化系統與架構視覺化，組織所有 Make 自動化與 AI 方案' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 8,
    question: 'Human-in-the-loop（人機雙向反饋系統）的主要應用是？',
    options: [
      { key: 'A', text: '完全自動化' },
      { key: 'B', text: '關鍵決策點人工介入、異常處理與糾錯機制、實時監控 AI 決策過程' },
      { key: 'C', text: '只有 AI 決策' },
      { key: 'D', text: '不需要人類參與' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    question: 'M8D 進階整合思維中，Make 不具備下列哪項功能？',
    options: [
      { key: 'A', text: '自動排程觸發' },
      { key: 'B', text: '內建向量檢索' },
      { key: 'C', text: '錯誤重試與補救機制' },
      { key: 'D', text: '版本控制' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 10,
    question: 'SRE（Site Reliability Engineering）在自動化流程管理中主要強調什麼？',
    options: [
      { key: 'A', text: '最大化吞吐量' },
      { key: 'B', text: '最低成本部署' },
      { key: 'C', text: '服務可靠度與可觀測性' },
      { key: 'D', text: '完全無代碼化' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 11,
    question: '私有雲部署時，容器化（Docker/Kubernetes）的主要好處為何？',
    options: [
      { key: 'A', text: '提升應用可攜性與隔離性' },
      { key: 'B', text: '降低所有硬體成本' },
      { key: 'C', text: '自動完成代碼撰寫' },
      { key: 'D', text: '免除資安設計' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 12,
    question: '高級 RAG 系統中，「多層次檢索」與「知識問答」的差異在於？',
    options: [
      { key: 'A', text: '檢索僅回傳文件，問答直接生成回答' },
      { key: 'B', text: '檢索使用向量，問答使用關鍵字' },
      { key: 'C', text: '多層次檢索不支援此次模式' },
      { key: 'D', text: '知識問答無需語意理解' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 13,
    question: '在代碼與無代碼混合策略中，下列何者能兼顧效率與可維護性？',
    options: [
      { key: 'A', text: '全部採用自訂程式碼專案' },
      { key: 'B', text: '完全依賴圖形化流程' },
      { key: 'C', text: '每次需求都重寫整個系統' },
      { key: 'D', text: '未來功能使用程式化節點，常規流程採無代碼模組' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 14,
    question: '在自動化成本最佳化中，哪種做法最有效？',
    options: [
      { key: 'A', text: '無限制開啟所有雲端資源' },
      { key: 'B', text: '手動刪除閒置 VM' },
      { key: 'C', text: '使用自動化關機與啟動排程' },
      { key: 'D', text: '永久保留不再使用的儲存空間' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 15,
    question: '在 Rerank 模式中，主要功能是？',
    options: [
      { key: 'A', text: '初次篩選文件' },
      { key: 'B', text: '將文字轉成向量' },
      { key: 'C', text: '實時生成回答' },
      { key: 'D', text: '重新對初次檢索結果進行相關性排序' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 16,
    question: 'Rerank 模式相比僅用向量相似度檢索，最主要的優勢是？',
    options: [
      { key: 'A', text: '大幅降低延遲' },
      { key: 'B', text: '增加結果多樣性' },
      { key: 'C', text: '減少向量維度' },
      { key: 'D', text: '提升最終排序的精確度' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 17,
    question: '使用 Smart4A 的 Rich Menu 模組，可以同時達成以下哪一項自動化需求？',
    options: [
      { key: 'A', text: '每月自動結算用戶互動次數' },
      { key: 'B', text: '在聊天室中自動回覆客服文字' },
      { key: 'C', text: '根據用戶身份自動更換專屬圖文選單' },
      { key: 'D', text: '從 LINE 下載聊天記錄為 Excel' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 18,
    question: '「亂數是探索空間的一部分」這個概念在人機協作中意味著？',
    options: [
      { key: 'A', text: '透過自然語言→代碼藍圖→UI/AI 雙向互動，建立觸發點、回饋回路與異常處理，使 AI 決策可人性化監管' },
      { key: 'B', text: '完全隨機決策' },
      { key: 'C', text: '不需要任何結構' },
      { key: 'D', text: '只依賴固定規則' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 19,
    question: 'Workshop 成果「跨平台 AI 自動化整合能力」強調什麼？',
    options: [
      { key: 'A', text: '只用一個平台' },
      { key: 'B', text: '只學理論' },
      { key: 'C', text: '學會整合 Make、Dify、n8n，獨立建構跨平台智慧自動化架構' },
      { key: 'D', text: '不需要實作' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 20,
    question: '高階課程與中階課程最本質的差異是什麼？',
    options: [
      { key: 'A', text: '工具不同' },
      { key: 'B', text: '只是難度提升' },
      { key: 'C', text: '沒有差異' },
      { key: 'D', text: '高階強調「人機協作」「自適應決策」「多平台整合」「探索性與收斂性平衡」' },
    ],
    correctAnswer: 'D',
  },
];

// Course quiz configurations
export const courseQuizzes: CourseQuiz[] = [
  {
    id: 'beginner',
    name: '設計流程（入門）',
    subtitle: '問道求索 - AI 與智働話的學習之道',
    description: '透過 Vibe coding 精準表達，心之所向。透過提問、對話，主動探索智働話之道，把無形的想法變成看得見、摸得著、用得上的實際產品。',
    url: 'https://dao.smart4a.tw/wendao',
    questions: beginnerQuestions,
    pointsPerQuestion: 5,
    totalPoints: 100, // 20 questions * 5 points
  },
  {
    id: 'basic',
    name: '工作流程（基礎）',
    subtitle: '智働話 - 工作流程：如水之形，隨器而變',
    description: '透過模組化設計實現可重複的穩定流程，建立企業級自動化工作流程。',
    url: 'https://dao.smart4a.tw/workflow',
    questions: basicQuestions,
    pointsPerQuestion: 5,
    totalPoints: 100, // 20 questions * 5 points
  },
  {
    id: 'intermediate',
    name: '思維流程（中階）',
    subtitle: '智働話 - 思維流程：如風之意，因勢而導',
    description: '全面掌握 Dify AI Agent，結合 Make 執行智慧決策與自動化。',
    url: 'https://dao.smart4a.tw/agent',
    questions: intermediateQuestions,
    pointsPerQuestion: 5,
    totalPoints: 100, // 20 questions * 5 points
  },
  {
    id: 'advanced',
    name: '互動流程（高階）',
    subtitle: '智働話 - 互動流程：如道之行，順應自然',
    description: '全面整合 AI 與自動化，開啟企業智慧轉型新時代。',
    url: 'https://dao.smart4a.tw/vibe',
    questions: advancedQuestions,
    pointsPerQuestion: 5,
    totalPoints: 100, // 20 questions * 5 points
  },
];

export const getCourseQuizById = (id: string): CourseQuiz | undefined => {
  return courseQuizzes.find((quiz) => quiz.id === id);
};

export const getCourseQuizByName = (name: string): CourseQuiz | undefined => {
  return courseQuizzes.find((quiz) => quiz.name === name);
};
