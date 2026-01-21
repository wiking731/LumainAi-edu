// Uzbek Law Reference Data
// Key codes and statutes for legal citation

export const uzbekLaws = {
    // Major Codes
    codes: {
        civil: {
            uz: "O'zbekiston Respublikasi Fuqarolik Kodeksi",
            ru: "Гражданский кодекс Республики Узбекистан",
            shortUz: "FK",
            shortRu: "ГК"
        },
        labor: {
            uz: "O'zbekiston Respublikasi Mehnat Kodeksi",
            ru: "Трудовой кодекс Республики Узбекистан",
            shortUz: "MK",
            shortRu: "ТК"
        },
        family: {
            uz: "O'zbekiston Respublikasi Oila Kodeksi",
            ru: "Семейный кодекс Республики Узбекистан",
            shortUz: "OK",
            shortRu: "СК"
        },
        administrative: {
            uz: "O'zbekiston Respublikasi Ma'muriy javobgarlik to'g'risidagi Kodeksi",
            ru: "Кодекс Республики Узбекистан об административной ответственности",
            shortUz: "MJK",
            shortRu: "КоАО"
        },
        housing: {
            uz: "O'zbekiston Respublikasi Uy-joy Kodeksi",
            ru: "Жилищный кодекс Республики Узбекистан",
            shortUz: "UJK",
            shortRu: "ЖК"
        },
        criminal: {
            uz: "O'zbekiston Respublikasi Jinoyat Kodeksi",
            ru: "Уголовный кодекс Республики Узбекистан",
            shortUz: "JK",
            shortRu: "УК"
        }
    },

    // Key Laws
    laws: {
        consumerProtection: {
            uz: "\"Iste'molchilar huquqlarini himoya qilish to'g'risida\"gi Qonun",
            ru: "Закон «О защите прав потребителей»"
        },
        personalData: {
            uz: "\"Shaxsiy ma'lumotlar to'g'risida\"gi Qonun",
            ru: "Закон «О персональных данных»"
        },
        advertising: {
            uz: "\"Reklama to'g'risida\"gi Qonun",
            ru: "Закон «О рекламе»"
        },
        eCommerce: {
            uz: "\"Elektron tijorat to'g'risida\"gi Qonun",
            ru: "Закон «Об электронной коммерции»"
        },
        constitution: {
            uz: "O'zbekiston Respublikasi Konstitutsiyasi",
            ru: "Конституция Республики Узбекистан"
        }
    },

    // Government Bodies
    bodies: {
        consumerAgency: {
            uz: "Iste'molchilar huquqlarini himoya qilish agentligi",
            ru: "Агентство по защите прав потребителей"
        },
        laborInspection: {
            uz: "Mehnat inspeksiyasi",
            ru: "Инспекция труда"
        },
        mahalla: {
            uz: "Mahalla fuqarolar yig'ini",
            ru: "Сход граждан махалли"
        },
        prosecutor: {
            uz: "Prokuratura",
            ru: "Прокуратура"
        },
        court: {
            uz: "Fuqarolok ishlari bo'yicha sud",
            ru: "Суд по гражданским делам"
        },
        police: {
            uz: "Ichki ishlar organlari (102)",
            ru: "Органы внутренних дел (102)"
        },
        antimonopoly: {
            uz: "Antimonopol qo'mita",
            ru: "Антимонопольный комитет"
        },
        dataProtection: {
            uz: "Shaxsiy ma'lumotlarni himoya qilish inspeksiyasi",
            ru: "Инспекция по защите персональных данных"
        }
    },

    // Common Article References (examples for prompt guidance)
    commonArticles: {
        laborTermination: {
            article: "100-modda",
            code: "labor",
            topic: "Mehnat shartnomasini bekor qilish asoslari"
        },
        unfairDismissal: {
            article: "106-modda",
            code: "labor",
            topic: "Ish beruvchi tashabbusi bilan mehnat shartnomasini bekor qilishning umumiy tartibi"
        },
        consumerReturn: {
            article: "11-modda",
            law: "consumerProtection",
            topic: "Tovarga nisbatan da'vo qilish huquqi"
        },
        propertyRights: {
            article: "164-modda",
            code: "civil",
            topic: "Mulk huquqining mazmuni"
        },
        divorce: {
            article: "39-modda",
            code: "family",
            topic: "Nikohni bekor qilish tartibi"
        }
    }
};

// Helper function to format citation
export function formatCitation(codeKey, article, lang = 'uz') {
    const code = uzbekLaws.codes[codeKey];
    if (!code) return article;

    if (lang === 'uz') {
        return `${code.uz}ning ${article}siga binoan`;
    } else {
        return `согласно ${article} ${code.ru}`;
    }
}

// Helper to get body name
export function getBodyName(bodyKey, lang = 'uz') {
    const body = uzbekLaws.bodies[bodyKey];
    return body ? body[lang] : bodyKey;
}
