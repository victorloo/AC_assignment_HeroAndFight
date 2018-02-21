class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }

  getHurt(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }
    //增加特效和傷害數字
    var _this = this;
    var i = 1;

    _this.id = setInterval(function () {
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/' + i + '.png';
      i++;
      //取消特效和傷害數字
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }

  die() {
    this.alive = false;
  }

  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%";
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log(" 召喚英雄 " + this.name + " !");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }

  getHeal(heal) {
    this.hp += heal;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log(" 遇到怪物 " + this.name + " !");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

//測試是否成功創建物件
var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);


//英雄和怪獸動作的時間軸
function heroAttack() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  //英雄攻擊
  setTimeout(function () {
    hero.element.classList.add("attacking");
    setTimeout(function () {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500)
  }, 100);
  //怪獸攻擊
  setTimeout(function () {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function () {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        //判斷英雄是否死亡
        if (hero.alive == false) {
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      finish();
    }
  }, 1100);
}

//英雄的治療流程，怪獸仍會攻擊
function heroHeal() {
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  //英雄治療
  hero.getHeal(30);
  //怪獸攻擊
  setTimeout(function () {
    monster.element.classList.add("attacking");
    setTimeout(function () {
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      endTurn();
      //判斷英雄是否死亡
      if (hero.alive == false) {
        finish();
      } else {
        document.getElementsByClassName("skill-block")[0].style.display = "block";
      }
    }, 500);
  }, 1100);
}

//開始戰鬥流程
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function () {
    heroAttack();
  }
}
addSkillEvent();

//治療流程
function addHealEvent() {
  var heal = document.getElementById("heal");
  heal.onclick = function () {
    heroHeal();
  }
}
addHealEvent();

//回合結束的機制
var rounds = 10;
function endTurn() {
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    finish();
  }
}

//遊戲結束
function finish() {
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}