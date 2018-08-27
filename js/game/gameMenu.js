class GameMenu {
  constructor() {
    this.gameContainerEl = document.getElementById("game-container");
    this.uiContainerEl = document.getElementById("ui-container");
    this.gameIntroEl = document.getElementById("game-intro");

    this.controlsTableEl = e("table", { class: "controls" }, [
      e("tr", null, [
        e("th", null, [
          e("span", { class: "kbd" }, "\u2190"),
          " / ",
          e("span", { class: "kbd" }, "\u2192"),
          " ou ",
          e("span", { class: "kbd" }, "Q"),
          " / ",
          e("span", { class: "kbd" }, "D")
        ]),
        e("td", null, "Se déplacer horizontalement")
      ]),
      e("tr", null, [
        e("th", null, [
          e("span", { class: "kbd" }, "\u2191"),
          " ou ",
          e("span", { class: "kbd" }, "Espace"),
          " ou ",
          e("span", { class: "kbd" }, "Z")
        ]),
        e("td", null, "Sauter")
      ]),
      e("tr", null, [
        e("th", null, e("span", { class: "kbd" }, "\u21b2")),
        e("td", null, "Ouvrir le bouclier")
      ]),
      e("tr", null, [
        e("th", null, e("span", { class: "kbd" }, "Échap")),
        e("td", null, "Afficher cet écran")
      ]),
      e("tr", null, [
        e("th", null, e("span", { class: "kbd" }, "F11")),
        e("td", null, "Plein écran")
      ]),
      e("tr", null, [
        e("th", null, [
          e("span", { class: "kbd" }, "+"),
          " / ",
          e("span", { class: "kbd" }, ")")
        ]),
        e("td", null, "Zoomer / Dézoomer")
      ])
    ]);
    this.controlsEl = e(
      "div",
      { class: "controls-container" },
      this.controlsTableEl
    );

    // MENU BUTTONS
    this.resumeButton = e(
      "li",
      { class: "game-menu__item" },
      e("a", { href: "", class: "game-menu__link" }, "REPRENDRE")
    );
    this.restartButton = e(
      "li",
      { class: "game-menu__item" },
      e("a", { href: "", class: "game-menu__link" }, "RECOMMENCER")
    );
    this.controlsButton = e(
      "li",
      { class: "game-menu__item" },
      e("a", { href: "", class: "game-menu__link" }, "CONTRÔLES")
    );
    this.loadButton = e(
      "li",
      { class: "game-menu__item" },
      e("a", { href: "", class: "game-menu__link" }, "CHARGER UN NIVEAU")
    );
    this.editorButton = e(
      "li",
      { class: "game-menu__item" },
      e(
        "a",
        { href: "./level-editor.html", class: "game-menu__link" },
        "OUVRIR L'ÉDITEUR"
      )
    );
    this.aboutButton = e(
      "li",
      { class: "game-menu__item" },
      e("a", { href: "", class: "game-menu__link" }, "À PROPOS")
    );
    this.exitButton = e(
      "li",
      { class: "game-menu__item" },
      e("a", { href: "", class: "game-menu__link" }, "QUITTER LE JEU")
    );
    this.backButton = e(
      "li",
      { class: "game-menu__item" },
      e("a", { href: "", class: "game-menu__link" }, "RETOUR")
    );
  }

  showGameOverMenu() {
    this.close();
    this.gameMenuEl = e("div", { class: "game-menu" }, [
      e("h2", null, "PERDU !"),
      e("ul", { class: "game-menu__list" }, [
        this.restartButton,
        this.loadButton,
        this.editorButton,
        this.exitButton
      ])
    ]);
    this.uiContainerEl.appendChild(this.gameMenuEl);
  }

  showVictoryMenu() {
    this.close();
    this.gameMenuEl = e("div", { class: "game-menu" }, [
      e("h2", null, "VICTOIRE !"),
      e("p", null, [
        "Vous avez retrouvé toutes mes principales compétences, vous pouvez avoir plus d'infos en consultant mon cv détaillé ",
        e("a", { href: "./assets/files/CV Thomas Vandenhede.pdf" }, "ici"),
        ". Ou bien essayez de battre votre score."
      ]),
      e("ul", { class: "game-menu__list" }, [
        this.restartButton,
        this.loadButton,
        this.editorButton,
        this.exitButton
      ])
    ]);
    this.uiContainerEl.appendChild(this.gameMenuEl);
  }

  showPauseMenu() {
    this.close();
    this.gameMenuEl = e("div", { class: "game-menu" }, [
      e("h2", null, "JEU EN PAUSE"),
      e("ul", { class: "game-menu__list" }, [
        this.resumeButton,
        this.restartButton,
        this.controlsButton,
        this.loadButton,
        this.editorButton,
        this.aboutButton,
        this.exitButton
      ])
    ]);
    this.uiContainerEl.appendChild(this.gameMenuEl);
  }

  showControlsMenu() {
    this.close();
    this.gameMenuEl = e("div", { class: "game-menu" }, [
      e("h2", null, "CONTRÔLES"),
      e("ul", { class: "game-menu__list" }, [this.controlsEl, this.backButton])
    ]);
    this.uiContainerEl.appendChild(this.gameMenuEl);
  }

  showAboutMenu() {
    this.close();
    this.gameMenuEl = e("div", { class: "game-menu" }, [
      e("h2", null, "À PROPOS"),
      e("p", null, [
        e(
          "p",
          null,
          "Ce jeu est un projet que j'ai réalisé pour ma formation de Dev JS à l'Ifocop de Paris. Il a nécessité un bon mois de travail et pas mal de nuits blanches."
        ),
        e(
          "p",
          null,
          "Le code est entièrement écrit en JavaScript, HTML et CSS et n'utilise aucun framework (hormis une touche de Bootstrap pour l'éditeur de niveaux)."
        )
      ]),
      e("ul", { class: "game-menu__list" }, [this.backButton])
    ]);
    this.uiContainerEl.appendChild(this.gameMenuEl);
  }

  showLoadMenu() {
    this.close();
    this.gameMenuEl = e("div", { class: "game-menu" }, [
      e("h2", null, "CHARGER UN NIVEAU"),
      e(
        "ul",
        { class: "game-menu__list" },
        Object.keys(gameData.levels).map(
          function(key) {
            return e(
              "li",
              null,
              e(
                "a",
                {
                  href: "",
                  onclick:
                    "event.preventDefault ? event.preventDefault() : (event.returnValue = false);" +
                    "game.currentLevelName = '" +
                    gameData.levels[key].name +
                    "';" +
                    "game.state = '" +
                    states.PAUSED +
                    "';" +
                    "game.startGame();"
                  // "game.buildGameLevel(game.currentLevelName);" +
                  // "game.camera.follow(game.player, (game.canvas.width - game.player.width) / 2 - 10, " +
                  // "(game.canvas.height - game.player.height) / 2 - 10)"
                },
                gameData.levels[key].name
              )
            );
          }.bind(this)
        )
      ),
      e("ul", { class: "game-menu__list" }, [this.backButton])
    ]);
    this.uiContainerEl.appendChild(this.gameMenuEl);
  }

  attachEventHandlers() {
    this.handleMenuResumeClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.unpause();
    };
    this.handleMenuLevelClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    };
    this.handleMenuAboutClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    };
    this.handleMenuExitClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.exit();
    };
    this.handleRestartClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.restartGame();
    };
    this.handleControlsButtonClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.showControlsMenu();
    };
    this.handleAboutButtonClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.showAboutMenu();
    };
    this.handleBackButtonClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.state === states.PAUSED && this.showPauseMenu();
      this.state === states.VICTORY && this.showVictoryMenu();
      this.state === states.GAME_OVER && this.showGameOverMenu();
    };
    this.handleLoadMenuClick = function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.showLoadMenu();
    };
    this.resumeButton.onclick = this.handleMenuResumeClick.bind(this);
    this.restartButton.onclick = this.handleRestartClick.bind(this);
    this.loadButton.onclick = this.handleMenuLevelClick.bind(this);
    this.aboutButton.onclick = this.handleMenuAboutClick.bind(this);
    this.exitButton.onclick = this.handleMenuExitClick.bind(this);
    this.controlsButton.onclick = this.handleControlsButtonClick.bind(this);
    this.aboutButton.onclick = this.handleAboutButtonClick.bind(this);
    this.backButton.onclick = this.handleBackButtonClick.bind(this);
    this.loadButton.onclick = this.handleLoadMenuClick.bind(this);
  }

  close() {
    var el = this.gameMenuEl;
    if (el) {
      emptyElement(this.gameMenuEl);
      this.uiContainerEl.removeChild(this.gameMenuEl);
    }
    this.gameMenuEl = null;
  }
}
