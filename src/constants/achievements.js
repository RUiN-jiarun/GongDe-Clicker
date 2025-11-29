const Achievements = [
    {
        name: "忏悔之路",
        icon: 'hand-point-up',
        icon_var: 'faHandPointUp',
        description: '第一次敲响木鱼',
        type: 'metris_player_click_counter',
        value: 1
    },
    {
        name: "轻车熟路",
        icon: 'hand-point-up',
        icon_var: 'faHandPointUp',
        description: '亲自敲100下木鱼',
        type: 'metris_player_click_counter',
        value: 100
    },
    {
        name: "信手拈来",
        icon: 'hand-point-up',
        icon_var: 'faHandPointUp',
        description: '亲自敲500下木鱼',
        type: 'metris_player_click_counter',
        value: 500
    },
    {
        name: "心诚则灵",
        icon: 'hand-point-up',
        icon_var: 'faHandPointUp',
        description: '亲自敲1000下木鱼',
        type: 'metris_player_click_counter',
        value: 1000
    },
    {
        name: "醍醐灌顶",
        icon: 'hand-point-up',
        icon_var: 'faHandPointUp',
        description: '亲自敲5000下木鱼',
        type: 'metris_player_click_counter',
        value: 5000
    },
    {
        name: "破戒僧",
        icon: 'hand-point-up',
        icon_var: 'faHandPointUp',
        description: '亲自敲10000下木鱼',
        type: 'metris_player_click_counter',
        value: 10000
    },
    {
        name: "念念有词",
        icon: 'mouse-pointer',
        icon_var: 'faMousePointer',
        description: '达到每秒敲3下木鱼',
        type: 'metris_player_click_frequency',
        value: 3
    },
    {
        name: "急不可耐",
        icon: 'mouse-pointer',
        icon_var: 'faMousePointer',
        description: '达到每秒敲5下木鱼',
        type: 'metris_player_click_frequency',
        value: 5
    },
    {
        name: "单身十年",
        icon: 'mouse-pointer',
        icon_var: 'faMousePointer',
        description: '达到每秒敲10下木鱼',
        type: 'metris_player_click_frequency',
        value: 10
    },
    {
        name: "鼠标精灵",
        icon: 'mouse-pointer',
        icon_var: 'faMousePointer',
        description: '达到每秒敲20下木鱼',
        type: 'metris_player_click_frequency',
        value: 20
    },
    {
        name: "稍有功德",
        icon: 'cookie',
        icon_var: 'faCookie',
        description: '最多积攒了100功德',
        type: 'metris_amount',
        value: 100
    },
    {
        name: "功德圆满",
        icon: 'cookie',
        icon_var: 'faCookie',
        description: '最多积攒了1000功德',
        type: 'metris_amount',
        value: 1000
    },
    {
        name: "功高盖世",
        icon: 'cookie',
        icon_var: 'faCookie',
        description: '最多积攒了5000功德',
        type: 'metris_amount',
        value: 5000
    },
    {
        name: "功德无量",
        icon: 'cookie',
        icon_var: 'faCookie',
        description: '最多积攒了10000功德',
        type: 'metris_amount',
        value: 10000
    },
    {
        name: "我佛慈悲",
        icon: 'piggy-bank',
        icon_var: 'faPiggyBank',
        description: '获得1次金手指',
        type: 'metris_gold_click_counter',
        value: 1
    },
    {
        name: "老天有眼",
        icon: 'piggy-bank',
        icon_var: 'faPiggyBank',
        description: '获得10次金手指',
        type: 'metris_gold_click_counter',
        value: 10
    },
    {
        name: "彩票达人",
        icon: 'piggy-bank',
        icon_var: 'faPiggyBank',
        description: '获得100次金手指',
        type: 'metris_gold_click_counter',
        value: 100
    },
    {
        name: "事半功倍",
        icon: 'stopwatch',
        icon_var: 'faStopwatch',
        description: '获得1次超级时间',
        type: 'metris_gold_time_counter',
        value: 1
    },
    {
        name: "上苍眷顾",
        icon: 'stopwatch',
        icon_var: 'faStopwatch',
        description: '获得10次超级时间',
        type: 'metris_gold_time_counter',
        value: 10
    },
    {
        name: "咋瓦鲁多",
        icon: 'stopwatch',
        icon_var: 'faStopwatch',
        description: '获得100次超级时间',
        type: 'metris_gold_time_counter',
        value: 100
    },
    {
        name: "赎罪券",
        icon: 'shopping-cart',
        icon_var: 'faShoppingCart',
        description: '购买1项物品',
        type: 'items_buy_counter',
        value: 1
    },
    {
        name: "花钱消灾",
        icon: 'shopping-cart',
        icon_var: 'faShoppingCart',
        description: '购买10项物品',
        type: 'items_buy_counter',
        value: 10
    },
    {
        name: "剁手狂魔",
        icon: 'shopping-cart',
        icon_var: 'faShoppingCart',
        description: '购买100项物品',
        type: 'items_buy_counter',
        value: 100
    },
    {
        name: "当头棒喝",
        icon: 'wand-magic',
        icon_var: 'faWandMagic',
        description: '购买100个槌子',
        type: 'stick_buy_counter',
        value: 100
    },
    {
        name: "僧多粥少",
        icon: 'person-praying',
        icon_var: 'faPersonPraying',
        description: '购买100个信徒',
        type: 'monk_buy_counter',
        value: 100
    },
    {
        name: "色即是空",
        icon: 'book-open',
        icon_var: 'faBookOpen',
        description: '购买100个金刚经',
        type: 'book_buy_counter',
        value: 100
    },
    {
        name: "佛光普照",
        icon: 'place-of-worship',
        icon_var: 'faPlaceOfWorship',
        description: '购买100个寺庙',
        type: 'temple_buy_counter',
        value: 100
    },
    {
        name: "主爱世人",
        icon: 'cross',
        icon_var: 'faCross',
        description: '购买100个基督',
        type: 'jesus_buy_counter',
        value: 100
    },
    {
        name: "逃离埃及",
        icon: 'star-of-david',
        icon_var: 'faStarOfDavid',
        description: '购买100个犹太',
        type: 'jew_buy_counter',
        value: 100
    },
    {
        name: "安拉胡巴",
        icon: 'star-and-crescent',
        icon_var: 'faStarAndCrescent',
        description: '购买100个清真',
        type: 'islam_buy_counter',
        value: 100
    },
    {
        name: "煮不在乎",
        icon: 'spaghetti-monster-flying',
        icon_var: 'faSpaghettiMonsterFlying',
        description: '购买100个飞天意面神教',
        type: 'pasta_buy_counter',
        value: 100
    },
    {
        name: "科学无罪",
        icon: 'atom',
        icon_var: 'faAtom',
        description: '购买100个粒子对撞器',
        type: 'atom_buy_counter',
        value: 100
    },
];

export default Achievements;