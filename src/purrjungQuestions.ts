import type { QuestionPair, DimensionQuestions } from './types.js';

/**
 * PurrJung Cat Personality Test - 16 Questions
 * Based on feline behavioral research and temperament studies
 *
 * Dimension Mappings (Cat Behavioral Interpretations):
 * - EI: Social vs Solitary - Seeks interaction vs prefers alone time
 * - SN: Routine vs Novelty - Prefers familiar patterns vs explores new things
 * - TF: Independent vs Bonded - Self-reliant decisions vs human-influenced
 * - JP: Structured vs Spontaneous - Predictable schedules vs impulsive behavior
 *
 * Each question is a bipolar trait pair scored on a 1-5 scale
 * 1 = Strongly left trait, 5 = Strongly right trait
 */
export const purrjungQuestions: QuestionPair[] = [
  // EI dimension (Questions 1-4): Social vs Solitary
  {
    id: 1,
    dimension: 'EI',
    title: {
      en: 'When visitors arrive at home, your cat typically...',
      zh: '当有访客到家时，你的猫通常会...',
      ja: '来客があった時、あなたの猫は通常...',
      ko: '손님이 집에 왔을 때, 당신의 고양이는 보통...',
      'zh-tw': '當有訪客到家時，你的貓通常會...',
    },
    leftTrait: {
      en: 'Approaches to investigate or greet',
      zh: '上前查看或迎接',
      ja: '調べに行く、または挨拶する',
      ko: '조사하거나 인사하러 다가간다',
      'zh-tw': '上前查看或迎接',
    },
    rightTrait: {
      en: 'Retreats to a hiding spot',
      zh: '躲到隐蔽处',
      ja: '隠れ場所に逃げる',
      ko: '숨는 곳으로 피한다',
      'zh-tw': '躲到隱蔽處',
    },
  },
  {
    id: 2,
    dimension: 'EI',
    title: {
      en: 'In a household with multiple family members, your cat...',
      zh: '在有多个家庭成员的家中，你的猫...',
      ja: '複数の家族がいる家庭で、あなたの猫は...',
      ko: '여러 가족 구성원이 있는 집에서, 당신의 고양이는...',
      'zh-tw': '在有多個家庭成員的家中，你的貓...',
    },
    leftTrait: {
      en: 'Seeks attention from everyone',
      zh: '向每个人寻求关注',
      ja: 'みんなから注目を求める',
      ko: '모든 사람에게 관심을 구한다',
      'zh-tw': '向每個人尋求關注',
    },
    rightTrait: {
      en: 'Bonds primarily with one person',
      zh: '主要与一个人建立联系',
      ja: '主に一人と絆を結ぶ',
      ko: '주로 한 사람과 유대를 형성한다',
      'zh-tw': '主要與一個人建立聯繫',
    },
  },
  {
    id: 3,
    dimension: 'EI',
    title: {
      en: 'During typical daytime hours, your cat prefers to...',
      zh: '在白天的大部分时间里，你的猫喜欢...',
      ja: '日中の時間帯、あなたの猫は...',
      ko: '낮 시간 동안, 당신의 고양이는...',
      'zh-tw': '在白天的大部分時間裡，你的貓喜歡...',
    },
    leftTrait: {
      en: 'Stay in rooms with people',
      zh: '待在有人的房间里',
      ja: '人がいる部屋にいる',
      ko: '사람들이 있는 방에 머문다',
      'zh-tw': '待在有人的房間裡',
    },
    rightTrait: {
      en: 'Find secluded spots away from activity',
      zh: '寻找远离活动的僻静角落',
      ja: '活動から離れた隠れ場所を見つける',
      ko: '활동에서 떨어진 한적한 곳을 찾는다',
      'zh-tw': '尋找遠離活動的僻靜角落',
    },
  },
  {
    id: 4,
    dimension: 'EI',
    title: {
      en: 'When you return home after being away, your cat...',
      zh: '当你外出归来时，你的猫...',
      ja: '外出から帰宅した時、あなたの猫は...',
      ko: '외출 후 집에 돌아왔을 때, 당신의 고양이는...',
      'zh-tw': '當你外出歸來時，你的貓...',
    },
    leftTrait: {
      en: 'Greets you at the door vocally',
      zh: '在门口叫着迎接你',
      ja: '声を出してドアで出迎える',
      ko: '소리를 내며 문에서 맞이한다',
      'zh-tw': '在門口叫著迎接你',
    },
    rightTrait: {
      en: 'Acknowledges you subtly or not at all',
      zh: '只是微微示意或完全无视',
      ja: 'さりげなく認識するか、全く反応しない',
      ko: '미묘하게 인식하거나 전혀 반응하지 않는다',
      'zh-tw': '只是微微示意或完全無視',
    },
  },

  // SN dimension (Questions 5-8): Routine vs Novelty
  {
    id: 5,
    dimension: 'SN',
    title: {
      en: 'When you rearrange furniture or introduce new objects, your cat...',
      zh: '当你重新摆放家具或引入新物品时，你的猫...',
      ja: '家具を並べ替えたり、新しい物を置いた時、あなたの猫は...',
      ko: '가구를 재배치하거나 새로운 물건을 들여놓으면, 당신의 고양이는...',
      'zh-tw': '當你重新擺放家具或引入新物品時，你的貓...',
    },
    leftTrait: {
      en: 'Shows stress or avoids the changed area',
      zh: '表现出压力或避开变化的区域',
      ja: 'ストレスを示すか、変わった場所を避ける',
      ko: '스트레스를 보이거나 변화된 영역을 피한다',
      'zh-tw': '表現出壓力或避開變化的區域',
    },
    rightTrait: {
      en: 'Investigates enthusiastically',
      zh: '热情地探索',
      ja: '熱心に調査する',
      ko: '열정적으로 조사한다',
      'zh-tw': '熱情地探索',
    },
  },
  {
    id: 6,
    dimension: 'SN',
    title: {
      en: 'Regarding feeding times and routines, your cat...',
      zh: '关于喂食时间和日常习惯，你的猫...',
      ja: '食事の時間やルーティンについて、あなたの猫は...',
      ko: '급식 시간과 일과에 관해, 당신의 고양이는...',
      'zh-tw': '關於餵食時間和日常習慣，你的貓...',
    },
    leftTrait: {
      en: 'Expects meals at exact times daily',
      zh: '期望每天在固定时间进食',
      ja: '毎日正確な時間に食事を期待する',
      ko: '매일 정확한 시간에 식사를 기대한다',
      'zh-tw': '期望每天在固定時間進食',
    },
    rightTrait: {
      en: 'Adapts easily to schedule changes',
      zh: '容易适应时间表变化',
      ja: 'スケジュールの変更に簡単に適応する',
      ko: '일정 변화에 쉽게 적응한다',
      'zh-tw': '容易適應時間表變化',
    },
  },
  {
    id: 7,
    dimension: 'SN',
    title: {
      en: 'When offered a new type of food or treat, your cat...',
      zh: '当提供新类型的食物或零食时，你的猫...',
      ja: '新しい種類の食べ物やおやつを提供された時、あなたの猫は...',
      ko: '새로운 종류의 음식이나 간식을 제공받으면, 당신의 고양이는...',
      'zh-tw': '當提供新類型的食物或零食時，你的貓...',
    },
    leftTrait: {
      en: 'Refuses or is suspicious of unfamiliar food',
      zh: '拒绝或对陌生食物持怀疑态度',
      ja: '不慣れな食べ物を拒否するか疑う',
      ko: '낯선 음식을 거부하거나 의심한다',
      'zh-tw': '拒絕或對陌生食物持懷疑態度',
    },
    rightTrait: {
      en: 'Tries new foods with interest',
      zh: '有兴趣尝试新食物',
      ja: '興味を持って新しい食べ物を試す',
      ko: '관심을 가지고 새로운 음식을 시도한다',
      'zh-tw': '有興趣嘗試新食物',
    },
  },
  {
    id: 8,
    dimension: 'SN',
    title: {
      en: "Your cat's preferred resting spots are...",
      zh: '你的猫喜欢的休息地点是...',
      ja: 'あなたの猫の好みの休憩場所は...',
      ko: '당신의 고양이가 선호하는 휴식 장소는...',
      'zh-tw': '你的貓喜歡的休息地點是...',
    },
    leftTrait: {
      en: 'Always the same familiar locations',
      zh: '总是相同的熟悉位置',
      ja: 'いつも同じなじみの場所',
      ko: '항상 같은 익숙한 장소',
      'zh-tw': '總是相同的熟悉位置',
    },
    rightTrait: {
      en: 'Varies frequently, exploring new spots',
      zh: '经常变化，探索新地点',
      ja: '頻繁に変わり、新しい場所を探る',
      ko: '자주 바뀌며, 새로운 장소를 탐색한다',
      'zh-tw': '經常變化，探索新地點',
    },
  },

  // TF dimension (Questions 9-12): Independent vs Bonded
  {
    id: 9,
    dimension: 'TF',
    title: {
      en: 'When you appear upset or unwell, your cat...',
      zh: '当你看起来心烦或身体不适时，你的猫...',
      ja: 'あなたが動揺したり体調が悪そうな時、あなたの猫は...',
      ko: '당신이 화가 나거나 몸이 안 좋아 보일 때, 당신의 고양이는...',
      'zh-tw': '當你看起來心煩或身體不適時，你的貓...',
    },
    leftTrait: {
      en: 'Continues normal behavior, unaffected',
      zh: '继续正常行为，不受影响',
      ja: '影響を受けず、通常の行動を続ける',
      ko: '영향 받지 않고 평소 행동을 계속한다',
      'zh-tw': '繼續正常行為，不受影響',
    },
    rightTrait: {
      en: 'Stays close and seems attentive to your mood',
      zh: '待在身边，似乎关注你的情绪',
      ja: '近くにいて、あなたの気分に注意を払っているようだ',
      ko: '가까이 있으며 당신의 기분에 주의를 기울이는 것 같다',
      'zh-tw': '待在身邊，似乎關注你的情緒',
    },
  },
  {
    id: 10,
    dimension: 'TF',
    title: {
      en: 'When deciding where to sleep at night, your cat...',
      zh: '当决定晚上睡在哪里时，你的猫...',
      ja: '夜どこで寝るか決める時、あなたの猫は...',
      ko: '밤에 어디서 잘지 결정할 때, 당신의 고양이는...',
      'zh-tw': '當決定晚上睡在哪裡時，你的貓...',
    },
    leftTrait: {
      en: 'Chooses based on comfort and temperature',
      zh: '根据舒适度和温度选择',
      ja: '快適さと温度に基づいて選ぶ',
      ko: '편안함과 온도에 따라 선택한다',
      'zh-tw': '根據舒適度和溫度選擇',
    },
    rightTrait: {
      en: 'Prefers sleeping near or with family members',
      zh: '喜欢睡在家人附近或一起',
      ja: '家族の近くや一緒に寝ることを好む',
      ko: '가족 근처나 함께 자는 것을 선호한다',
      'zh-tw': '喜歡睡在家人附近或一起',
    },
  },
  {
    id: 11,
    dimension: 'TF',
    title: {
      en: "Your cat's response to verbal praise or encouragement is...",
      zh: '你的猫对言语表扬或鼓励的反应是...',
      ja: '言葉による称賛や励ましに対するあなたの猫の反応は...',
      ko: '칭찬이나 격려에 대한 당신의 고양이의 반응은...',
      'zh-tw': '你的貓對言語表揚或鼓勵的反應是...',
    },
    leftTrait: {
      en: 'Indifferent to human vocal cues',
      zh: '对人类的声音信号漠不关心',
      ja: '人間の声のシグナルに無関心',
      ko: '인간의 음성 신호에 무관심하다',
      'zh-tw': '對人類的聲音信號漠不關心',
    },
    rightTrait: {
      en: 'Responds positively, seems to enjoy it',
      zh: '积极回应，似乎很享受',
      ja: '積極的に反応し、楽しんでいるようだ',
      ko: '긍정적으로 반응하며, 즐기는 것 같다',
      'zh-tw': '積極回應，似乎很享受',
    },
  },
  {
    id: 12,
    dimension: 'TF',
    title: {
      en: "When you call your cat's name, it typically...",
      zh: '当你叫你的猫的名字时，它通常...',
      ja: '猫の名前を呼ぶと、通常...',
      ko: '고양이 이름을 부르면, 보통...',
      'zh-tw': '當你叫你的貓的名字時，牠通常...',
    },
    leftTrait: {
      en: 'Ignores or acknowledges minimally',
      zh: '忽略或只是稍微回应',
      ja: '無視するか、最小限の反応をする',
      ko: '무시하거나 최소한으로 반응한다',
      'zh-tw': '忽略或只是稍微回應',
    },
    rightTrait: {
      en: 'Comes or responds attentively',
      zh: '过来或专注地回应',
      ja: '来るか、注意深く反応する',
      ko: '오거나 주의 깊게 반응한다',
      'zh-tw': '過來或專注地回應',
    },
  },

  // JP dimension (Questions 13-16): Structured vs Spontaneous
  {
    id: 13,
    dimension: 'JP',
    title: {
      en: "Your cat's daily activity pattern is...",
      zh: '你的猫的日常活动模式是...',
      ja: 'あなたの猫の毎日の活動パターンは...',
      ko: '당신의 고양이의 일상 활동 패턴은...',
      'zh-tw': '你的貓的日常活動模式是...',
    },
    leftTrait: {
      en: 'Highly predictable, same times each day',
      zh: '非常可预测，每天相同时间',
      ja: '非常に予測可能で、毎日同じ時間',
      ko: '매우 예측 가능하며, 매일 같은 시간',
      'zh-tw': '非常可預測，每天相同時間',
    },
    rightTrait: {
      en: 'Unpredictable, varies from day to day',
      zh: '不可预测，每天都不同',
      ja: '予測不可能で、日によって変わる',
      ko: '예측 불가능하며, 날마다 다르다',
      'zh-tw': '不可預測，每天都不同',
    },
  },
  {
    id: 14,
    dimension: 'JP',
    title: {
      en: 'During play sessions, your cat...',
      zh: '在玩耍时，你的猫...',
      ja: '遊びの時間中、あなたの猫は...',
      ko: '놀이 시간 동안, 당신의 고양이는...',
      'zh-tw': '在玩耍時，你的貓...',
    },
    leftTrait: {
      en: 'Plays methodically, focused on one toy',
      zh: '有条不紊地玩，专注于一个玩具',
      ja: '方法的に遊び、一つのおもちゃに集中する',
      ko: '체계적으로 놀며, 하나의 장난감에 집중한다',
      'zh-tw': '有條不紊地玩，專注於一個玩具',
    },
    rightTrait: {
      en: 'Switches rapidly between activities',
      zh: '在活动之间快速切换',
      ja: '活動を急速に切り替える',
      ko: '활동 사이를 빠르게 전환한다',
      'zh-tw': '在活動之間快速切換',
    },
  },
  {
    id: 15,
    dimension: 'JP',
    title: {
      en: "Your cat's energy bursts (zoomies) occur...",
      zh: '你的猫的能量爆发（疯跑）发生在...',
      ja: 'あなたの猫のエネルギー爆発（ズーミーズ）は...',
      ko: '당신의 고양이의 에너지 폭발(줌미)은...',
      'zh-tw': '你的貓的能量爆發（瘋跑）發生在...',
    },
    leftTrait: {
      en: 'At predictable times (e.g., after meals, evening)',
      zh: '在可预测的时间（如餐后、傍晚）',
      ja: '予測可能な時間に（例：食後、夕方）',
      ko: '예측 가능한 시간에 (예: 식후, 저녁)',
      'zh-tw': '在可預測的時間（如餐後、傍晚）',
    },
    rightTrait: {
      en: 'Randomly throughout the day or night',
      zh: '全天或夜间随机发生',
      ja: '一日中または夜間にランダムに',
      ko: '하루 종일 또는 밤에 무작위로',
      'zh-tw': '全天或夜間隨機發生',
    },
  },
  {
    id: 16,
    dimension: 'JP',
    title: {
      en: "When it's time for grooming or nail trimming, your cat...",
      zh: '当需要梳毛或剪指甲时，你的猫...',
      ja: 'グルーミングや爪切りの時間になると、あなたの猫は...',
      ko: '그루밍이나 발톱 다듬기 시간이 되면, 당신의 고양이는...',
      'zh-tw': '當需要梳毛或剪指甲時，你的貓...',
    },
    leftTrait: {
      en: 'Tolerates routine care calmly',
      zh: '平静地接受日常护理',
      ja: '日常のケアを穏やかに受け入れる',
      ko: '일상적인 관리를 차분히 받아들인다',
      'zh-tw': '平靜地接受日常護理',
    },
    rightTrait: {
      en: 'Resists or escapes unpredictably',
      zh: '不可预测地抵抗或逃跑',
      ja: '予測不可能に抵抗したり逃げたりする',
      ko: '예측 불가능하게 저항하거나 도망친다',
      'zh-tw': '不可預測地抵抗或逃跑',
    },
  },
];

// Question IDs grouped by dimension for scoring
export const purrjungDimensionQuestions: DimensionQuestions = {
  EI: [1, 2, 3, 4],
  SN: [5, 6, 7, 8],
  TF: [9, 10, 11, 12],
  JP: [13, 14, 15, 16],
} as const;

// Get questions sorted by ID for test presentation
export const sortedPurrjungQuestions = [...purrjungQuestions].sort((a, b) => a.id - b.id);

// Total number of questions
export const PURRJUNG_TOTAL_QUESTIONS = 16;

// Questions per dimension
export const PURRJUNG_QUESTIONS_PER_DIMENSION = 4;
