const safeValue = require("./utils");

// Attribute names
const attrName = {
  en: {
    str: ["Str", "Strength"],
    dex: ["Dex", "Dexterity"],
    con: ["Con","Constitution"],
    wis: ["Wis", "Wisdom"],
    int: ["Int", "Intelligence"],
    cha: ["Cha", "Charisma"],
    ac: ["AC", "Armour class"],
    fortune: ["FR", "Fortune"],
    hp: ["HP","Health points"],
    inv: ["Inv","Initiative"],
    atk: ["Atk Bonus","Attack bonus"],
    save_poison: ["Poison","Poison"],
    save_breath: ["Breath","Breath"],
    save_change: ["Change","Change"],
    save_magic: ["Magic","Magic"],
    save_object: ["Magic item","Magic item"],
  } 
}


// Attribute bonus
const attrBonus = (value) => {
  const num = Number.parseInt(value);
  if (Number.isNaN(num)) return "0";
  switch (num) {
    case 1:
      return "-4";
    case 2:
    case 3:
      return "-3";
    case 4:
    case 5:
      return "-2";
    case 6:
    case 7:
    case 8:
      return "-1";
    case 9:
    case 10:
    case 11:
    case 12:
      return "0";
    case 13:
    case 14:
    case 15:
      return "+1";
    case 16:
    case 17:
      return "+2";
    case 18:
    case 19:
      return "+3";
  }
  return "0";
};




// Class initiative
const classAlias = {
  "wizard": "wizard",
  "mage": "wizard",
  "czarodziej": "wizard",
  "czarodziejka": "wizard",
  "mag": "wizard",
  "witch": "wizard",
  "warrior": "warrior",
  "wojownik": "warrior",
  "wojowniczka": "warrior",
  "knight": "warrior",
  "rycerz": "warrior",
  "rycerka": "warrior",
  "rogue": "rogue",
  "szelma": "rogue",
  "złodziej": "rogue",
  "thief": "rogue",
}
const classInv = {
  "wizard": 0,
  "warrior": 1,
  "rogue": 2,
} 

const classAttackBonus = {
  wizard: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5],
  warrior: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  rogue: [0, 1, 1, 2, 3, 3, 4, 5, 5, 6],
};

const savePoison = {
  wizard: [14, 14, 14, 14, 14, 13, 13, 13, 13, 13],
  warrior: [14, 14, 13, 13, 11, 11, 10, 10, 8, 8],
  rogue: [13, 13, 13, 13, 12, 12, 12, 12, 11, 11],
};

const saveBreath = {
  wizard: [15, 15, 15, 15, 15, 13, 13, 13, 13, 13],
  warrior: [17, 17, 16, 16, 14, 14, 13, 13, 11, 11],
  rogue: [16, 16, 16, 16, 15, 15, 15, 15, 14, 14],
};

const saveChange  = {
  wizard: [13, 13, 13, 13, 13, 11, 11, 11, 11, 11],
  warrior: [15, 15, 14, 14, 12, 12, 11, 11, 9, 9],
  rogue: [13, 13, 12, 12, 11, 11, 11, 11, 9, 9],
};

const saveMagic = {
  wizard: [12, 12, 12, 12, 12, 10, 10, 10, 10, 10],
  warrior: [17, 17, 14, 14, 12, 12, 11, 11, 9, 9],
  rogue: [15, 15, 15, 15, 13, 13, 13, 13, 11, 11],
};

const saveObject  = {
  wizard: [11, 11, 11, 11, 11, 9, 9, 9, 9, 9],
  warrior: [16, 16, 15, 15, 13, 13, 12, 12, 10, 10],
  rogue: [14, 14, 14, 14, 12, 12, 12, 12, 10, 10],
};

// Attribute block
const renderAttrBlock = (lang, name, value) => {
  const modifier = attrBonus(value);
  const nm = attrName[lang][name];
  const result = {}
  result[name] = value;
  result[`${name}_name`] = nm[0];
  result[`${name}_title`] = nm[1];
  result[`${name}_bonus`] = attrBonus(value);
  return result;
}

const renderOthers = (lang, data) => {
  const result = {...data};
  if (data.class) {
    result["klass"] = data.class;
  }
  if (data.ac) {
    result["ac_name"] = attrName[lang]['ac'][1];
  }
  result['fortune_name'] = attrName[lang]['fortune'][1];
  result['hp_name'] = attrName[lang]['hp'][1];
  result['initiative_name'] = attrName[lang]['inv'][1];
  result['atk_name'] = attrName[lang]['atk'][1];
  if (data.state) {
    if (data.state.fortune) result['current_fortune'] = data.state.fortune;
    if (data.state.hp) result['current_hp'] = data.state.hp;
  }
  const klass = classAlias[data.class];
  if (data.class) {
    result['initiative'] = classInv[klass];
    if (data.level) {
      result["atk"] = classAttackBonus[klass][data.level];
      result["save_poison"] = savePoison[klass][data.level];
      result["save_breath"] = saveBreath[klass][data.level];
      result["save_change"] = saveChange[klass][data.level];
      result["save_magic"] = saveMagic[klass][data.level];
      result["save_object"] = saveObject[klass][data.level];
    }
  }
  result["save_poison_name"] = attrName[lang]["save_poison"][0];
  result["save_breath_name"] = attrName[lang]["save_breath"][0];
  result["save_change_name"] = attrName[lang]["save_change"][0];
  result["save_magic_name"] = attrName[lang]["save_magic"][0];
  result["save_object_name"] = attrName[lang]["save_object"][0];
  return result;
}

// Main render function
const btwRender = (data) => {
  let result = {...data};

  let lang = "en";
  if (data.lang && attrName[data.lang]) {
    lang = data.lang;
  }
  
  if (data.attr) {
    if (data.attr.str) result = {...result, ...renderAttrBlock(lang, 'str',data.attr.str)};
    if (data.attr.dex) result = {...result, ...renderAttrBlock(lang, 'dex',data.attr.dex)};
    if (data.attr.con) result = {...result, ...renderAttrBlock(lang, 'con',data.attr.con)};
    if (data.attr.int) result = {...result, ...renderAttrBlock(lang, 'int',data.attr.int)};
    if (data.attr.wis) result = {...result, ...renderAttrBlock(lang, 'wis',data.attr.wis)};
    if (data.attr.cha) result = {...result, ...renderAttrBlock(lang, 'cha',data.attr.cha)};
  }
  result = renderOthers(lang, result);
  return result;
}

const btwTemplate =  `
h1 #{name}
h3 #{klass} #{level} (#{alignment})
div(class='flex-column')
  div(class='flex-center-row')
    div(class='flex-center-column')
      div(class='text-huge' title=str_title) #{str_name}
      div(class='statblock-attr-value') #{str}
      div #{str_bonus}
    div(class='flex-center-column')
      div(class='text-huge' title=dex_title) #{dex_name}
      div(class='statblock-attr-value') #{dex}
      div #{dex_bonus}
    div(class='flex-center-column')
      div(class='text-huge' title=con_title) #{con_name}
      div(class='statblock-attr-value') #{con}
      div #{con_bonus}
    div(class='flex-center-column')
      div(class='text-huge' title=int_title) #{int_name}
      div(class='statblock-attr-value') #{int}
      div #{int_bonus}
    div(class='flex-center-column')
      div(class='text-huge' title=wis_title) #{wis_name}
      div(class='statblock-attr-value') #{wis}
      div #{wis_bonus}      
    div(class='flex-center-column')
      div(class='text-huge' title=cha_title) #{cha_name}
      div(class='statblock-attr-value') #{cha}
      div #{cha_bonus}
  div(class='statblock-section-title') Saves
  div(class='flex-center-row')
    div(class='flex-center-column')
      div(class='statblock-circle-value') #{save_poison}
      div #{save_poison_name}
    div(class='flex-center-column')
      div(class='statblock-circle-value') #{save_breath}
      div #{save_breath_name}      
    div(class='flex-center-column')
      div(class='statblock-circle-value') #{save_change}
      div #{save_change_name}
    div(class='flex-center-column')
      div(class='statblock-circle-value') #{save_magic}
      div #{save_magic_name}    
    div(class='flex-center-column')
      div(class='statblock-circle-value') #{save_object}
      div #{save_object_name}   
  div(class='statblock-section-title') More attrs         
  div(class='flex-center-row')
    div(class='flex-center-column')
      div(class='statblock-square-value') #{ac}
      div #{ac_name}
    div(class='flex-center-column')
      div(class='statblock-square-value') #{current_fortune}/#{fortune}
      div #{fortune_name}
    div(class='flex-center-column')
      div(class='statblock-square-value') #{current_hp}/#{hp}
      div #{hp_name}
    div(class='flex-center-column')
      div(class='statblock-square-value') #{initiative}
      div #{initiative_name}
    div(class='flex-center-column')
      div(class='statblock-square-value') #{atk}
      div #{atk_name}
`;

module.exports = { btwRender, btwTemplate } ;