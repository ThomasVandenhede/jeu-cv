var utils = require("../utils");

function GameMenu(props) {
  this.game = props.game;

  this.gameContainerEl = document.getElementById("game-container");
  this.uiContainerEl = document.getElementById("ui-container");
  this.gameIntroEl = document.getElementById("game-intro");

  // MENU BUTTONS
  this.resumeButtonVNode = utils.h(
    "li",
    {
      class: "game-menu__item"
    },
    utils.h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          document.documentElement.requestFullscreen &&
            document.documentElement.requestFullscreen();
          this.game.unpause();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "REPRENDRE"
    )
  );

  this.restartButtonVNode = utils.h(
    "li",
    {
      class: "game-menu__item"
    },
    utils.h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          document.documentElement.requestFullscreen &&
            document.documentElement.requestFullscreen();
          this.game.restart();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "RECOMMENCER"
    )
  );

  this.controlsButtonVNode = utils.h(
    "li",
    {
      class: "game-menu__item"
    },
    utils.h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.showControlsMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "CONTRÔLES"
    )
  );

  this.aboutButtonVNode = utils.h(
    "li",
    {
      class: "game-menu__item"
    },
    utils.h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.showAboutMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "À PROPOS"
    )
  );

  this.backButtonVNode = utils.h(
    "li",
    {
      class: "game-menu__item"
    },
    utils.h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.game.state === this.game.constructor.states.PAUSED &&
            this.showPauseMenu();
          this.game.state === this.game.constructor.states.VICTORY &&
            this.showVictoryMenu();
          this.game.state === this.game.constructor.states.GAME_OVER &&
            this.showGameOverMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "RETOUR"
    )
  );

  this.loadButtonVNode = utils.h(
    "li",
    {
      class: "game-menu__item"
    },
    utils.h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.showLoadMenu();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "CHARGER UN NIVEAU"
    )
  );

  this.editorButtonVNode = utils.h(
    "li",
    { class: "game-menu__item" },
    utils.h(
      "a",
      { href: "./level-editor.html", class: "game-menu__link" },
      "OUVRIR L'ÉDITEUR"
    )
  );

  this.exitButtonVNode = utils.h(
    "li",
    {
      class: "game-menu__item"
    },
    utils.h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          document.exitFullscreen =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;

          document.exitFullscreen && document.exitFullscreen();

          this.game.exit();
        }.bind(this),
        onkeyup: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          if (event.keyCode === 13) {
            event.target.click();
          }
        }
      },
      "QUITTER LE JEU"
    )
  );
}

GameMenu.prototype.showMenu = function(vNode) {
  this.close();
  this.uiContainerEl.appendChild(utils.render(vNode));
};

GameMenu.prototype.showGameOverMenu = function() {
  this.showMenu(
    utils.h(
      "div",
      { class: "game-menu" },
      utils.h("h2", null, "PERDU !"),
      utils.h(
        "ul",
        { class: "game-menu__list" },
        this.restartButtonVNode,
        this.loadButtonVNode,
        this.editorButtonVNode,
        this.exitButtonVNode
      )
    )
  );
};

GameMenu.prototype.showVictoryMenu = function() {
  this.showMenu(
    utils.h(
      "div",
      { class: "game-menu" },
      utils.h("h2", null, "VICTOIRE !"),
      utils.h(
        "p",
        null,
        "Vous avez retrouvé toutes mes principales compétences, vous pouvez avoir plus d'infos en consultant mon cv détaillé ",
        utils.h(
          "a",
          { href: "./assets/files/CV Thomas Vandenhede.pdf" },
          "ici"
        ),
        ". Ou bien essayez de battre votre score."
      ),
      utils.h(
        "ul",
        { class: "game-menu__list" },
        this.restartButtonVNode,
        this.loadButtonVNode,
        this.editorButtonVNode,
        this.exitButtonVNode
      )
    )
  );
};

GameMenu.prototype.showPauseMenu = function() {
  this.showMenu(
    utils.h(
      "div",
      { class: "game-menu" },
      utils.h("h2", null, "JEU EN PAUSE"),
      utils.h(
        "ul",
        { class: "game-menu__list" },
        this.resumeButtonVNode,
        this.restartButtonVNode,
        this.controlsButtonVNode,
        this.loadButtonVNode,
        this.editorButtonVNode,
        this.aboutButtonVNode,
        this.exitButtonVNode
      )
    )
  );
};

GameMenu.prototype.showControlsMenu = function() {
  this.showMenu(
    utils.h(
      "div",
      { class: "game-menu" },
      utils.h("h2", null, "CONTRÔLES"),
      utils.h(
        "ul",
        { class: "game-menu__list" },
        utils.h(
          "div",
          { class: "controls-container" },
          utils.h(
            "table",
            { class: "controls" },
            utils.h(
              "tr",
              null,
              utils.h(
                "th",
                null,
                utils.h("span", { class: "kbd" }, "\u2190"),
                " / ",
                utils.h("span", { class: "kbd" }, "\u2192"),
                " ou ",
                utils.h("span", { class: "kbd" }, "Q"),
                " / ",
                utils.h("span", { class: "kbd" }, "D")
              ),
              utils.h("td", null, "Se déplacer horizontalement")
            ),
            utils.h(
              "tr",
              null,
              utils.h(
                "th",
                null,
                utils.h("span", { class: "kbd" }, "\u2191"),
                " ou ",
                utils.h("span", { class: "kbd" }, "Espace"),
                " ou ",
                utils.h("span", { class: "kbd" }, "Z")
              ),
              utils.h("td", null, "Sauter")
            ),
            utils.h(
              "tr",
              null,
              utils.h("th", null, utils.h("span", { class: "kbd" }, "\u21b2")),
              utils.h("td", null, "Ouvrir le bouclier")
            ),
            utils.h(
              "tr",
              null,
              utils.h("th", null, utils.h("span", { class: "kbd" }, "Échap")),
              utils.h("td", null, "Afficher cet écran")
            ),
            utils.h(
              "tr",
              null,
              utils.h("th", null, utils.h("span", { class: "kbd" }, "F11")),
              utils.h("td", null, "Plein écran")
            ),
            utils.h(
              "tr",
              null,
              utils.h(
                "th",
                null,
                utils.h("span", { class: "kbd" }, "+"),
                " / ",
                utils.h("span", { class: "kbd" }, ")")
              ),
              utils.h("td", null, "Zoomer / Dézoomer")
            )
          )
        ),
        this.backButtonVNode
      )
    )
  );
};

GameMenu.prototype.showAboutMenu = function() {
  this.showMenu(
    utils.h(
      "div",
      { class: "game-menu" },
      utils.h("h2", null, "À PROPOS"),
      utils.h(
        "p",
        null,
        utils.h(
          "p",
          null,
          "Ce jeu est un projet que j'ai réalisé pour ma formation de Dev JS à l'Ifocop de Paris. Il a nécessité un bon mois de travail et pas mal de nuits blanches."
        ),
        utils.h(
          "p",
          null,
          "Le code est entièrement écrit en JavaScript, HTML et CSS et n'utilise aucun framework (hormis une touche de Bootstrap pour l'éditeur de niveaux)."
        )
      ),
      utils.h("ul", { class: "game-menu__list" }, this.backButtonVNode)
    )
  );
};

GameMenu.prototype.showLoadMenu = function() {
  this.showMenu(
    utils.h(
      "div",
      { class: "game-menu" },
      utils.h("h2", null, "CHARGER UN NIVEAU"),
      utils.h(
        "ul",
        { class: "game-menu__list" },
        Object.keys(gameData.levels).map(
          function(key) {
            return utils.h(
              "li",
              null,
              utils.h(
                "a",
                {
                  href: "",
                  onclick: function(event) {
                    event.preventDefault
                      ? event.preventDefault()
                      : (event.returnValue = false);
                    this.game.currentLevelName = gameData.levels[key].name;
                    this.game.state = this.game.constructor.states.PAUSED;
                    this.game.start();
                  }.bind(this)
                },
                gameData.levels[key].name
              )
            );
          }.bind(this)
        )
      ),
      utils.h("ul", { class: "game-menu__list" }, this.backButtonVNode)
    )
  );
};

GameMenu.prototype.close = function() {
  var gameMenuEl = document.querySelector(".game-menu");
  if (gameMenuEl) {
    utils.emptyElement(gameMenuEl);
    this.uiContainerEl.removeChild(gameMenuEl);
  }
};

module.exports = GameMenu;
