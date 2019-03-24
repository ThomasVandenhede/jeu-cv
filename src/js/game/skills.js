var Skill = require("./skill");

function SkillHtml(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/html-5-icon.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillHtml.prototype = Object.create(Skill.prototype);
SkillHtml.prototype.constructor = SkillHtml;

function SkillCss(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/css-3-icon.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillCss.prototype = Object.create(Skill.prototype);
SkillCss.prototype.constructor = SkillCss;

function SkillSass(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/sass-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillSass.prototype = Object.create(Skill.prototype);
SkillSass.prototype.constructor = SkillSass;

function SkillBootstrap(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/bootstrap-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillBootstrap.prototype = Object.create(Skill.prototype);
SkillBootstrap.prototype.constructor = SkillBootstrap;

function SkillJquery(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/jquery-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillJquery.prototype = Object.create(Skill.prototype);
SkillJquery.prototype.constructor = SkillJquery;

function SkillReact(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/react-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillReact.prototype = Object.create(Skill.prototype);
SkillReact.prototype.constructor = SkillReact;

function SkillAngular(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/angular-logo.svg",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillAngular.prototype = Object.create(Skill.prototype);
SkillAngular.prototype.constructor = SkillAngular;

function SkillNode(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/nodejs-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillNode.prototype = Object.create(Skill.prototype);
SkillNode.prototype.constructor = SkillNode;

function SkillMeteor(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/meteor-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillMeteor.prototype = Object.create(Skill.prototype);
SkillMeteor.prototype.constructor = SkillMeteor;

function SkillMongo(props) {
  Skill.call(
    this,
    Object.assign({}, props, {
      src: "./assets/images/mongodb-logo.png",
      width: props.width || 50,
      height: props.height || 50
    })
  );
}
SkillMongo.prototype = Object.create(Skill.prototype);
SkillMongo.prototype.constructor = SkillMongo;

module.exports = {
  SkillAngular: SkillAngular,
  SkillBootstrap: SkillBootstrap,
  SkillCss: SkillCss,
  SkillHtml: SkillHtml,
  SkillJquery: SkillJquery,
  SkillMeteor: SkillMeteor,
  SkillMongo: SkillMongo,
  SkillNode: SkillNode,
  SkillReact: SkillReact,
  SkillSass: SkillSass
};
