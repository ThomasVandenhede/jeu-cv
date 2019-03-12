function GameMenu(props) {
  this.game = props.game;

  this.gameContainerEl = document.getElementById("game-container");
  this.uiContainerEl = document.getElementById("ui-container");
  this.gameIntroEl = document.getElementById("game-intro");

  // MENU BUTTONS
  this.resumeButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          fullscreen();
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

  this.restartButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          fullscreen();
          this.game.restartGame();
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

  this.controlsButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
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

  this.aboutButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
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

  this.backButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
      "a",
      {
        href: "",
        class: "game-menu__link",
        onclick: function(event) {
          event.preventDefault
            ? event.preventDefault()
            : (event.returnValue = false);
          this.game.state === Game.states.PAUSED && this.showPauseMenu();
          this.game.state === Game.states.VICTORY && this.showVictoryMenu();
          this.game.state === Game.states.GAME_OVER && this.showGameOverMenu();
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

  this.loadButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
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

  this.editorButtonVNode = h(
    "li",
    { class: "game-menu__item" },
    h(
      "a",
      { href: "./level-editor.html", class: "game-menu__link" },
      "OUVRIR L'ÉDITEUR"
    )
  );

  this.exitButtonVNode = h(
    "li",
    {
      class: "game-menu__item"
    },
    h(
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
  this.uiContainerEl.appendChild(render(vNode));
};

GameMenu.prototype.showGameOverMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "PERDU !"),
      h(
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
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "VICTOIRE !"),
      h(
        "p",
        null,
        "Vous avez retrouvé toutes mes principales compétences, vous pouvez avoir plus d'infos en consultant mon cv détaillé ",
        h("a", { href: "./assets/files/CV Thomas Vandenhede.pdf" }, "ici"),
        ". Ou bien essayez de battre votre score."
      ),
      h(
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
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "JEU EN PAUSE"),
      h(
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
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "CONTRÔLES"),
      h(
        "ul",
        { class: "game-menu__list" },
        h(
          "div",
          { class: "controls-container" },
          h(
            "table",
            { class: "controls" },
            h(
              "tr",
              null,
              h(
                "th",
                null,
                h("span", { class: "kbd" }, "\u2190"),
                " / ",
                h("span", { class: "kbd" }, "\u2192"),
                " ou ",
                h("span", { class: "kbd" }, "Q"),
                " / ",
                h("span", { class: "kbd" }, "D")
              ),
              h("td", null, "Se déplacer horizontalement")
            ),
            h(
              "tr",
              null,
              h(
                "th",
                null,
                h("span", { class: "kbd" }, "\u2191"),
                " ou ",
                h("span", { class: "kbd" }, "Espace"),
                " ou ",
                h("span", { class: "kbd" }, "Z")
              ),
              h("td", null, "Sauter")
            ),
            h(
              "tr",
              null,
              h("th", null, h("span", { class: "kbd" }, "\u21b2")),
              h("td", null, "Ouvrir le bouclier")
            ),
            h(
              "tr",
              null,
              h("th", null, h("span", { class: "kbd" }, "Échap")),
              h("td", null, "Afficher cet écran")
            ),
            h(
              "tr",
              null,
              h("th", null, h("span", { class: "kbd" }, "F11")),
              h("td", null, "Plein écran")
            ),
            h(
              "tr",
              null,
              h(
                "th",
                null,
                h("span", { class: "kbd" }, "+"),
                " / ",
                h("span", { class: "kbd" }, ")")
              ),
              h("td", null, "Zoomer / Dézoomer")
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
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "À PROPOS"),
      h(
        "p",
        null,
        h(
          "p",
          null,
          "Ce jeu est un projet que j'ai réalisé pour ma formation de Dev JS à l'Ifocop de Paris. Il a nécessité un bon mois de travail et pas mal de nuits blanches."
        ),
        h(
          "p",
          null,
          "Le code est entièrement écrit en JavaScript, HTML et CSS et n'utilise aucun framework (hormis une touche de Bootstrap pour l'éditeur de niveaux)."
        )
      ),
      h("ul", { class: "game-menu__list" }, this.backButtonVNode)
    )
  );
};

GameMenu.prototype.showLoadMenu = function() {
  this.showMenu(
    h(
      "div",
      { class: "game-menu" },
      h("h2", null, "CHARGER UN NIVEAU"),
      h(
        "ul",
        { class: "game-menu__list" },
        Object.keys(gameData.levels).map(
          function(key) {
            return h(
              "li",
              null,
              h(
                "a",
                {
                  href: "",
                  onclick: function(event) {
                    event.preventDefault
                      ? event.preventDefault()
                      : (event.returnValue = false);
                    this.game.currentLevelName = gameData.levels[key].name;
                    this.game.state = Game.states.PAUSED;
                    this.game.startGame();
                  }.bind(this)
                },
                gameData.levels[key].name
              )
            );
          }.bind(this)
        )
      ),
      h("ul", { class: "game-menu__list" }, this.backButtonVNode)
    )
  );
};

GameMenu.prototype.close = function() {
  var gameMenuEl = document.querySelector(".game-menu");
  if (gameMenuEl) {
    emptyElement(gameMenuEl);
    this.uiContainerEl.removeChild(gameMenuEl);
  }
};
