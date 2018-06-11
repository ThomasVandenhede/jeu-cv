var Game = (function() {
  function Game(props) {}

  var states = {
    PAUSED: "paused",
    RUNNING: "running",
    INTRO: "intro",
    GAME_OVER: "game over",
    VICTORY: "victory",
    EXIT: 0
  };

  Game.prototype.init = function(config) {
    // config
    if (config) {
      this.shouldDisplayDebug = config.shouldDisplayDebug || false;
      this.shouldDisplayRulers =
        config.shouldDisplayRulers !== undefined
          ? config.shouldDisplayRulers
          : true;
    }

    // initalize canvas(es) and html elements
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // initialize game menu elements
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

    // // display pause menu
    // this.showPauseMenu();
    // this.uiContainerEl.appendChild(this.gameMenuEl);

    // attach event handlers for game menu
    this.attachEventHandlers();

    // initialize keyboard & sound
    this.keyboard = keyboardManager.getInstance();
    this.keyboard.init(this);
    this.soundManager = soundManager.getInstance();
    this.soundManager.init(gameData);

    // initialize level manager
    this.levelManager = levelManager.getInstance();
    this.levelManager.init(this);
    this.currentLevelName = "level 1";

    // camera
    this.camera = new Camera({
      worldRect: this.worldRect,
      canvas: this.canvas
    });

    // grid
    this.grid = new Grid({
      canvas: this.canvas,
      camera: this.camera,
      mouse: this.mouse
    });
  };

  Game.prototype.setBackground = function(path) {
    this.canvas.style.backgroundImage = "url(" + path + ")";
    this.canvas.backgroundSize = canvas.width + "px " + canvas.height + "px";
  };

  // Build different game menus
  Game.prototype.showGameOverMenu = function() {
    this.closeGameMenu();
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
  };

  Game.prototype.showVictoryMenu = function() {
    this.closeGameMenu();
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
  };

  Game.prototype.showPauseMenu = function() {
    this.closeGameMenu();
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
  };

  Game.prototype.showControlsMenu = function() {
    this.closeGameMenu();
    this.gameMenuEl = e("div", { class: "game-menu" }, [
      e("h2", null, "CONTRÔLES"),
      e("ul", { class: "game-menu__list" }, [this.controlsEl, this.backButton])
    ]);
    this.uiContainerEl.appendChild(this.gameMenuEl);
  };

  Game.prototype.showAboutMenu = function() {
    this.closeGameMenu();
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
  };

  Game.prototype.showLoadMenu = function() {
    this.closeGameMenu();
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
  };

  Game.prototype.attachEventHandlers = function() {
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
  };

  Game.prototype.loadGameDataFromLocalStorage = function() {
    var savedData = localStorage.getItem("gameData");
    if (savedData) {
      gameData = JSON.parse(savedData);
    }
  };

  Game.prototype.buildGameLevel = function(levelName) {
    this.level = this.levelManager.buildLevel(levelName);
    if (this.level !== null) {
      this.worldRect = this.level.worldRect;
      this.player = this.level.player;
      this.platforms = this.level.platforms;
      this.ennemies = this.level.ennemies;
      this.skills = this.level.skills;
    }

    // temporary objects
    this.lasers = [];
    this.particles = [];
  };

  Game.prototype.buildGameObjects = function() {
    this.gameObjects = []
      .concat(this.platforms)
      .concat(this.skills)
      .concat(this.ennemies)
      .concat(this.lasers)
      .concat([this.player]);
  };

  Game.prototype.closeGameMenu = function() {
    var el = this.gameMenuEl;
    if (el) {
      emptyElement(this.gameMenuEl);
      this.uiContainerEl.removeChild(this.gameMenuEl);
    }
    this.gameMenuEl = null;
  };

  Game.prototype.handleKeyboard = function() {
    var keyboard = this.keyboard;
    var player = this.player;

    // do not handle keyboard if player is dead
    if (player.isDead) {
      return;
    }

    player.v.y =
      player.isColliding[1] * player.GRAVITY_ACCELERATION > 0
        ? player.collidingWith[1].v.y
        : player.v.y;
    if (keyboard.RIGHT || keyboard.LEFT) {
      keyboard.LEFT && player.moveLeft();
      keyboard.RIGHT && player.moveRight();
    } else {
      player.v.x =
        player.isColliding[1] * player.GRAVITY_ACCELERATION > 0
          ? player.collidingWith[1].v.x
          : 0;
      player.v.x = player.isColliding[0]
        ? player.collidingWith[0].v.x
        : player.v.x;
    }

    if (keyboard.DOWN) {
      player.GRAVITY_ACCELERATION > 0 ? player.crouch() : player.jump();
    } else {
      player.stand();
    }

    if (keyboard.UP) {
      player.GRAVITY_ACCELERATION > 0 ? player.jump() : player.crouch();
    }

    if (keyboard.SPACE) {
      player.jump();
    }

    if (keyboard.ENTER) {
      if (!player.shield.isAnimating) {
        player.shield.isOpen ? player.shield.close() : player.shield.open();
      }
    }
  };

  Game.prototype.displaySkills = function(ctx, camera) {
    var acquiredSkillsCount = this.player.skills.length;
    var totalSkillsCount = acquiredSkillsCount + this.skills.length;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(
      60,
      100,
      100,
      100 + ((acquiredSkillsCount + (acquiredSkillsCount % 2)) / 2) * 45
    );
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "16px arial";
    ctx.fillText("Skills", 110, 130);
    ctx.fillText(acquiredSkillsCount + " / " + totalSkillsCount, 110, 160);
    this.player.skills.forEach(
      function(skill, index) {
        ctx.drawImage(
          skill.image,
          70 + (index % 2) * 45,
          200 + ((index - (index % 2)) / 2) * 45,
          30,
          30
        );
      }.bind(this)
    );
    ctx.restore();
  };

  Game.prototype.updateScene = function() {
    var player = this.player;

    // update objects to be rendered
    !player.isDead &&
      this.ennemies.forEach(
        function(ennemy) {
          var distanceVector = Vector.subtract(player.center, ennemy.center);
          if (
            distanceVector.normSquared < Math.pow(ennemy.visionRange, 2) &&
            Date.now() - ennemy.lastFiredAt > ennemy.fireDelay
          ) {
            var direction = distanceVector.getUnitVector();
            this.lasers.push(ennemy.attack(direction));
          }
        }.bind(this)
      );
    this.lasers.forEach(
      function(laser, index) {
        if (laser.hasReachedMaxRange()) {
          this.destroyLaser(index);
        } else {
          laser.update();
        }
      }.bind(this)
    );
    player.shield.update();
    this.platforms.forEach(function(platform) {
      platform.update();
    });
    player.update();

    // update particles
    this.particles.forEach(
      function(particle, index) {
        if (Date.now() - particle.createdAt > particle.maxLife) {
          this.particles.splice(index, 1);
        }
        particle.update();
      }.bind(this)
    );

    // kill player if they move outside of the world boundaries
    if (!player.isDead && !player.within(this.worldRect)) {
      player.die();
    }
    this.camera.update();
  };

  Game.prototype.renderBackground = function(ctx, camera) {
    this.canvas.style.backgroundPosition =
      -camera.x * 0.502 + "px " + -camera.y * 0.502 + "px";
  };

  Game.prototype.renderScene = function(ctx, camera) {
    this.buildGameObjects();

    // only draw objects in the viewport
    this.gameObjects.forEach(
      function(obj) {
        obj.getBoundingRect().overlaps(this.camera) && obj.draw(ctx, camera);
      }.bind(this)
    );
    this.ghostPositions.length && this.displayGhost(ctx, camera);
    this.particles.forEach(function(particle) {
      particle.draw(ctx, camera);
    });
    this.lifeBar.draw(ctx);
    this.timer.draw(ctx);
    this.shouldDisplayRulers &&
      this.grid.draw(ctx, camera, { isGame: true, shouldDisplayRulers: true });
    this.displaySkills(ctx, camera);
  };

  Game.prototype.displayGhost = function(ctx, camera) {
    if (this.ghost) {
      var applyCamToArr = function() {
        return Object.values(camera.apply.apply(camera, arguments));
      };
      ctx.save();
      ctx.fillStyle = "rgba(180, 180, 180, 0.7)";
      ctx.fillRect.apply(
        ctx,
        applyCamToArr(this.ghost.x, this.ghost.y).concat([
          this.player.width * camera.zoomLevel,
          this.player.height * camera.zoomLevel
        ])
      );
      if (!this.ghostPositions[this.ghostIndex + 1]) {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo.apply(ctx, applyCamToArr(this.ghost.x, this.ghost.y));
        ctx.lineTo.apply(
          ctx,
          applyCamToArr(
            this.ghost.x + this.player.width,
            this.ghost.y + this.player.height
          )
        );
        ctx.moveTo.apply(
          ctx,
          applyCamToArr(this.ghost.x + this.player.width, this.ghost.y)
        );
        ctx.lineTo.apply(
          ctx,
          applyCamToArr(this.ghost.x, this.ghost.y + this.player.height)
        );
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  Game.prototype.clearCanvas = function(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.prototype.fillCanvas = function(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.prototype.drawRulers = function(ctx, camera) {
    var minX = Math.floor(this.camera.left / 100, 2) * 100;
    var maxX = Math.ceil(this.camera.right / 100, 2) * 100;
    var minY = Math.floor(this.camera.top / 100, 2) * 100;
    var maxY = Math.ceil(this.camera.bottom / 100, 2) * 100;

    ctx.save();
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = gameData.colors.STAR_WARS_YELLOW; // Star Wars yellow
    ctx.strokeStyle = "white";
    for (var i = minX; i <= maxX; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i - camera.left, 0);
      ctx.lineTo(i - camera.left, 10);
      ctx.stroke();
      ctx.moveTo(i - camera.left, this.canvas.height - 10);
      ctx.lineTo(i - camera.left, this.canvas.height);
      ctx.stroke();

      ctx.fillText(i, i + 10 - camera.left, 20);
      ctx.fillText(i, i + 10 - camera.left, this.canvas.height - 10);
    }
    for (var i = minY; i <= maxY; i += 100) {
      ctx.beginPath();
      ctx.moveTo(0, i - camera.top);
      ctx.lineTo(10, i - camera.top);
      ctx.stroke();
      ctx.moveTo(this.canvas.width - 10, i - camera.top);
      ctx.lineTo(this.canvas.width, i - camera.top);
      ctx.stroke();

      ctx.fillText(-i, 20, i - camera.top);
      ctx.fillText(-i, this.canvas.width - 50, i - camera.top);
    }
    ctx.restore();
  };

  Game.prototype.pause = function() {
    if (this.state !== states.GAME_OVER && this.state !== states.VICTORY) {
      !this.gameMenuEl && this.showPauseMenu();
      this.timer.pause();
      this.soundManager.pauseAll();
      this.state = states.PAUSED;
    }
  };

  Game.prototype.unpause = function() {
    this.state !== states.GAME_OVER &&
      this.state !== states.VICTORY &&
      this.closeGameMenu();
    this.timer.play();
    this.soundManager.playPaused();
    this.state = states.RUNNING;
  };

  Game.prototype.destroyLaser = function(index) {
    this.lasers.splice(index, 1);
  };

  Game.prototype.destroyParticleSet = function(index) {
    this.particleSet;
  };

  Game.prototype.detectCollisions = function() {
    this.detectCollisionsWithPlatforms();
    this.handleCollisionsWithSkills();
    this.handleCollisionsWithLasers();
  };

  Game.prototype.handleCollisionsWithLasers = function() {
    var playerBox = this.player.getBoundingRect();
    var shieldBox = this.player.shield.getBoundingRect();
    !this.player.shield.isOpen
      ? this.lasers.forEach(
          function(laser, index) {
            var laserBox = laser.getBoundingRect();
            if (physics.collision.AABBWithAABB(playerBox, laserBox)) {
              if (
                playerBox.contains(laser.A.x, laser.A.y) ||
                playerBox.contains(laser.B.x, laser.B.y) ||
                physics.collision.segmentAABB(laser.A, laser.B, playerBox) <
                  Math.POSITIVE_INFINITY
              ) {
                this.player.applyDamage(laser.damage);
                this.player.hitPoints <= 0 && this.player.die();
                this.particles.push(
                  hitParticles(
                    laser.B.x,
                    laser.B.y,
                    Vector.subtract(laser.A, laser.B),
                    "red"
                  )
                );
                this.player.hitParticles = hitParticles;
                this.destroyLaser(index);
              }
            }
          }.bind(this)
        )
      : this.lasers.forEach(
          function(laser, index) {
            var laserBox = laser.getBoundingRect();
            if (this.player.shield.hasCollisionWithLaser(laser)) {
              this.destroyLaser(index);
            }
          }.bind(this)
        );
  };

  Game.prototype.handleCollisionsWithSkills = function() {
    var playerBox = this.player.getBoundingRect();
    this.skills.forEach(
      function(skill, index) {
        var skillBox = skill.getBoundingRect();
        if (physics.collision.AABBWithAABB(playerBox, skillBox)) {
          this.player.skills.push(skill);
          this.timer.countdownStart += 5 * 1000; // add 5s to timer
          this.skills.splice(index, 1);
        }
      }.bind(this)
    );
  };

  Game.prototype.getCollidablePlatformsInViewport = function() {
    return this.gameObjects.filter(
      function(gameObject) {
        var box = gameObject.getBoundingRect();
        if (box !== this.player) {
          box.touched = false;
          box.overlaps(this.camera);
          return true;
        }
        return false;
      }.bind(this)
    );
  };

  Game.prototype.getCollisions = function(collidableGameObjects) {
    var player = this.player;
    var collisions = [];

    // loop over each collidable object and store collision data
    collidableGameObjects.forEach(function(box) {
      var md = AABB.minkowskiDifference(box, player);
      // window.md = md; // remove this when everything's working
      var relMotion = Vector.subtract(player.v, box.v).multiplyByScalar(dt);
      var colInfo = physics.collision.segmentAABB(new Vector(), relMotion, md);
      var t = colInfo.t;
      var side = colInfo.side;

      // create array of all collisions for that frame
      if (t < Number.POSITIVE_INFINITY) {
        var d = side[0] ? relMotion.x * side[0] : relMotion.y * side[1];
        // If there is a collision along one of the axes,
        // add collision to the array of collision characteristics
        d > 0 &&
          collisions.push({
            side: side,
            box: box,
            d: d
          });
      }
    });
    return collisions;
  };

  Game.prototype.detectCollisionsWithPlatforms = function() {
    var player = this.player;
    var collidableWith = this.getCollidablePlatformsInViewport();
    var collisions;
    var boxH = null,
      boxV = null;

    // apply gravity acceleration and reset collisions
    player.applyGravity();
    player.isColliding = [0, 0];
    collisions = this.getCollisions(collidableWith);

    /**
     * COLLISION RESOLUTION
     **/
    // // no collision detected, do nothing
    // if (!collisions.length) {
    //   return;
    // }

    // determine FINAL COLLISION characteristics
    var dH = 0,
      dV = 0;
    collisions.forEach(function(collision) {
      var side = collision.side;
      var d = collision.d;
      var box = collision.box;

      // die if player has double sided collision
      if (
        side[0] * player.isColliding[0] < 0 ||
        side[1] * player.isColliding[1] < 0
      ) {
        player.die();
        return;
      }

      // set player collisions [0, 1] + [-1, 0] -> [-1, 1]
      if (box.solid) {
        player.isColliding[0] = side[0] ? side[0] : player.isColliding[0];
        if (box.passthrough) {
          player.isColliding[1] =
            side[1] * player.GRAVITY_ACCELERATION > 0
              ? side[1]
              : player.isColliding[1];
        } else {
          player.isColliding[1] = side[1] ? side[1] : player.isColliding[1];
        }
      }

      // if new value of d is greater than the old one then the new box is the one in contact with the player
      if (side[0]) {
        if (d > dH) {
          dH = d;
          boxH = box;
        }
      } else if (side[1]) {
        if (d > dV) {
          dV = d;
          boxV = box;
        }
      }
    });

    // resolve horizontal collision
    if (player.isColliding[0]) {
      player.x =
        player.isColliding[0] > 0
          ? toFixedPrecision(boxH.left + boxH.v.x * dt - player.width, 2) // snap
          : toFixedPrecision(boxH.right + boxH.v.x * dt, 2);
    }
    // resolve vertical collision
    if (player.isColliding[1]) {
      player.y =
        player.isColliding[1] > 0
          ? toFixedPrecision(boxV.top + boxV.v.y * dt - player.height, 2)
          : toFixedPrecision(boxV.bottom + boxV.v.y * dt, 2);
    }

    // inform the player about which objects it's colliding with
    player.collidingWith = [boxH, boxV];
    if (boxH) {
      boxH.touched = true;
    }
    if (boxV) {
      boxV.touched = true;
    }
  };

  Game.prototype.restartGame = function() {
    this.ghostIndex = 0;
    cancelAnimationFrame(this.rAF);
    this.closeGameMenu();
    this.unpause();
    this.startGame();
  };

  Game.prototype.startGame = function() {
    this.rAF && cancelAnimationFrame(this.rAF);
    // game state
    this.loadGameDataFromLocalStorage();
    this.buildGameLevel(this.currentLevelName);

    // game objects
    this.buildGameObjects();

    // player ghost
    this.ghostIndex = 0;
    this.ghostPositions =
      Array.isArray(this.ghostPositionsTemp) &&
      this.ghostPositionsTemp.length !== 0
        ? this.ghostPositionsTemp.slice(0)
        : [];
    this.ghostPositionsTemp = [];

    // background
    this.setBackground("./assets/images/background_2000_stars.png");

    // camera
    this.camera.follow(
      this.player,
      (this.canvas.width - this.player.width) / 2 - 10,
      (this.canvas.height - this.player.height) / 2 - 10
    );

    // UI
    this.timer = new GameTimer({
      x: canvas.width - 170,
      y: 35,
      width: 80,
      height: 30,
      countdownStart: this.level.countdownStart
    });
    this.lifeBar = new LifeBar({
      x: 60,
      y: 40,
      width: 200,
      height: 15,
      gameObject: this.player
    });
    requestAnimationFrame(this.pauseMenuLoop.bind(this));
  };

  Game.prototype.exit = function() {
    show(this.gameIntroEl);
    this.closeGameMenu();
    hide(this.gameContainerEl);
    this.state = states.EXIT;
    delete game;
  };

  Game.prototype.checkVictory = function() {
    if (this.skills.length <= 0 && !(this.state === states.GAME_OVER)) {
      this.state = states.VICTORY;
      setTimeout(
        function() {
          this.showVictoryMenu();
        }.bind(this),
        1000
      );
    }
  };

  Game.prototype.checkDefeat = function() {
    if (this.player.isDead && !(this.state === states.GAME_OVER)) {
      this.state = states.GAME_OVER;
      setTimeout(
        function() {
          this.showGameOverMenu();
        }.bind(this),
        1000
      );
    }
  };

  /**
   * Intro loop
   */
  Game.prototype.introLoop = function() {
    switch (this.state) {
      case states.INTRO:
        this.rAF = requestAnimationFrame(this.introLoop.bind(this));
        break;
      case states.RUNNING:
        this.rAF = requestAnimationFrame(this.mainLoop.bind(this));
        break;
      case states.PAUSED:
        this.rAF = requestAnimationFrame(this.pauseMenuLoop.bind(this));
        break;
      case states.GAME_OVER:
      case states.VICTORY:
        this.rAF = requestAnimationFrame(this.gameOverLoop.bind(this));
      default:
        break;
    }
  };

  Game.prototype.updateGhost = function() {
    // display current ghost
    this.ghost = this.ghostPositions.length
      ? this.ghostPositions[this.ghostIndex]
      : null;

    // store position for next ghost
    this.ghostPositions[this.ghostIndex + 1] && this.ghostIndex++;
    this.ghostPositionsTemp.push({
      time: this.timer.totalTime,
      x: this.player.x,
      y: this.player.y
    });
  };

  /**
   * Main game loop
   */
  Game.prototype.mainLoop = function() {
    // time management
    this.timer.update();
    dt = toFixedPrecision(this.timer.getEllapsedTime() / 1000, 2);

    // ghost
    this.updateGhost();

    // kill player if countdown is finished
    !this.player.isDead &&
      this.timer.countdownStart - this.timer.totalTime < 1000 &&
      this.player.die();

    // keyboard
    this.handleKeyboard();

    //
    for (var i = 0; i < this.gameObjects.length; i++) {
      var drawable = this.gameObjects[i];
      typeof drawable.updateVelocity === "function" &&
        drawable.updateVelocity();
    }

    !this.player.isDead && this.detectCollisions();
    this.updateScene();
    this.checkVictory();
    this.checkDefeat();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

    switch (this.state) {
      case states.INTRO:
        this.rAF = requestAnimationFrame(this.introLoop.bind(this));
        break;
      case states.RUNNING:
        this.rAF = requestAnimationFrame(this.mainLoop.bind(this));
        break;
      case states.PAUSED:
        this.rAF = requestAnimationFrame(this.pauseMenuLoop.bind(this));
        break;
      case states.GAME_OVER:
      case states.VICTORY:
        this.rAF = requestAnimationFrame(this.gameOverLoop.bind(this));
      default:
        break;
    }
  };

  /**
   * Pause menu loop
   */
  Game.prototype.pauseMenuLoop = function() {
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.camera.updateDimensions(); // continue updating camera in case browser window is resized
    this.renderScene(this.ctx, this.camera);

    switch (this.state) {
      case states.INTRO:
        this.rAF = requestAnimationFrame(this.introLoop.bind(this));
        break;
      case states.RUNNING:
        this.rAF = requestAnimationFrame(this.mainLoop.bind(this));
        break;
      case states.PAUSED:
        this.rAF = requestAnimationFrame(this.pauseMenuLoop.bind(this));
        break;
      case states.GAME_OVER:
      case states.VICTORY:
        this.rAF = requestAnimationFrame(this.gameOverLoop.bind(this));
      default:
        break;
    }
  };

  Game.prototype.gameOverLoop = function() {
    this.updateScene();
    this.clearCanvas(this.ctx);
    this.renderBackground(this.ctx, this.camera);
    this.renderScene(this.ctx, this.camera);

    switch (this.state) {
      case states.INTRO:
        this.rAF = requestAnimationFrame(this.introLoop.bind(this));
        break;
      case states.RUNNING:
        this.rAF = requestAnimationFrame(this.mainLoop.bind(this));
        break;
      case states.PAUSED:
        this.rAF = requestAnimationFrame(this.pauseMenuLoop.bind(this));
        break;
      case states.GAME_OVER:
      case states.VICTORY:
        this.rAF = requestAnimationFrame(this.gameOverLoop.bind(this));
      default:
        break;
    }
  };

  Game.prototype.updateDebugInfo = function() {
    var player = this.player;
    var camera = this.camera;

    var debugEl = e("div", { class: "debug" }, [
      e("h2", null, "debug info"),
      e("section", { class: "player" }, [
        e("p", null, [
          e("strong", null, "x: "),
          this.player.x,
          e("br"),
          e("strong", null, " y: "),
          this.player.y
        ]),
        e("p", null, [
          e("strong", null, "width: "),
          this.player.width,
          e("br"),
          e("strong", null, " height: "),
          this.player.height
        ]),
        e("p", null, [
          e("strong", null, "crouching: "),
          this.player.isCrouching
        ]),
        e("p", null, [
          e("strong", null, "speedX: "),
          this.player.v.x,
          e("br"),
          e("strong", null, " speedY: "),
          this.player.v.y
        ]),
        e("p", null, [
          e("strong", null, "accelX: "),
          this.player.acceleration.x,
          e("strong", null, " accelY: "),
          this.player.acceleration.y
        ]),
        e("p", null, [
          e("strong", null, "colliding: "),
          this.player.isColliding
        ])
      ]),
      e("section", { class: "camera" }, [
        e("p", null, [e("strong", null, "camX: "), this.camera.x]),
        e("p", null, [e("strong", null, "camY: "), this.camera.y])
      ])
    ]);
  };

  return Game;
})();
