var gameData = {
  constants: {
    GRAVITY_ACCELERATION: 1600
  },
  colors: {
    STAR_WARS_YELLOW: "#ffd700"
  },
  sounds: {
    location: "./assets/sounds/",
    files: [
      {
        filename: "Hit 1.mp4",
        volume: 0.2
      },
      {
        filename: "Hit 2.mp4",
        volume: 0.2
      },
      {
        filename: "Light swing 1.mp4",
        volume: 1
      },
      {
        filename: "Light swing 1.mp4",
        volume: 1
      },
      {
        filename: "Medium hum.mp4",
        volume: 0.15
      },
      {
        filename: "Open.mp3",
        volume: 0.4
      },
      {
        filename: "Close.mp3",
        volume: 0.6
      },
      {
        filename: "impactsplat03.mp3.flac",
        volume: 0.8
      }
    ]
  },
  musics: {
    location: "./assets/music/",
    files: [
      {
        filename: "Star Wars - John Williams - Duel Of The Fates.mp3",
        volume: 1
      }
    ]
  },
  levels: {
    "test level": {
      name: "test level",
      countdownStart: 5000,
      cssBackground: {
        src: "./assets/images/background_1000_stars.png",
        size: "800px 600px"
      },
      worldRect: {
        props: {
          x: -1000,
          y: -2000,
          width: 5000,
          height: 8000
        }
      },
      player: {
        type: "Player",
        props: {
          x: 10,
          y: -200,
          color: "red"
        }
      },
      platforms: [
        { type: "Platform", props: { x: 0, y: -350, width: 200, height: 5 } },
        {
          type: "Platform",
          props: { x: 350, y: -250, width: 50, height: 5 }
        },
        { type: "Platform", props: { x: 0, y: -130, width: 180, height: 5 } },
        { type: "Platform", props: { x: 0, y: -150, width: 180, height: 5 } },
        {
          type: "Platform",
          props: { x: 330, y: -400, width: 150, height: 5 }
        },
        { type: "Platform", props: { x: 150, y: 200, width: 50, height: 5 } },
        {
          type: "Platform",
          props: { x: 500, y: -270, width: 80, height: 80 }
        },
        {
          type: "Platform",
          props: { x: 600, y: -500, width: 400, height: 20 }
        }
      ],
      ennemies: [],
      skills: [
        {
          type: "SkillHtml",
          props: {
            x: 350,
            y: -570,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillCss",
          props: {
            x: 500,
            y: -600,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillJquery",
          props: {
            x: 1000,
            y: -600,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillMongo",
          props: {
            x: 200,
            y: 0,
            width: 50,
            height: 50
          }
        }
      ]
    },
    "level 1": {
      name: "level 1",
      countdownStart: 15000,
      cssBackground: {
        src: "./assets/images/background_1000_stars.png",
        size: "800px 600px"
      },
      worldRect: {
        props: {
          x: 0,
          y: -2000,
          width: 3000,
          height: 3000
        }
      },
      player: {
        type: "Player",
        props: {
          x: 10,
          y: -500
        }
      },
      platforms: [
        {
          type: "Platform",
          props: { x: -20, y: -400, width: 220, height: 10 }
        },
        {
          type: "Platform",
          props: { x: 350, y: -250, width: 50, height: 10 }
        },
        {
          type: "Platform",
          props: {
            x: 0,
            y: -130,
            width: 180,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: {
            x: 0,
            y: -150,
            width: 180,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: {
            x: 330,
            y: -390,
            width: 150,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: { x: 150, y: 200, width: 50, height: 10 }
        },
        {
          type: "Platform",
          props: { x: 500, y: -270, width: 80, height: 80 }
        },
        {
          type: "Platform",
          props: { x: 480, y: -170, width: 120, height: 160 }
        },
        {
          type: "Platform",
          props: {
            x: 500,
            y: 10,
            width: 80,
            height: 120,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: {
            x: 480,
            y: 180,
            width: 120,
            height: 120,
            passtarough: true
          }
        },
        {
          type: "Platform",
          props: { x: 700, y: -80, width: 30, height: 20 }
        },
        {
          type: "Platform",
          props: {
            x: 350,
            y: 70,
            width: 30,
            height: 20,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: {
            x: 700,
            y: 210,
            width: 30,
            height: 20,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: { x: 200, y: -470, width: 10, height: 170 }
        },
        {
          type: "Platform",
          props: { x: 0, y: -10000, width: 0, height: 20000 }
        },
        {
          type: "Platform",
          props: {
            x: 0,
            y: -500,
            width: 400,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: { x: 0, y: -600, width: 100, height: 100 }
        },
        {
          type: "Platform",
          props: { x: 400, y: -600, width: 100, height: 100 }
        },
        {
          type: "Platform",
          props: {
            x: 100,
            y: -600,
            width: 400,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: { x: 0, y: -700, width: 200, height: 100 }
        },
        {
          type: "Platform",
          props: { x: 500, y: -700, width: 100, height: 100 }
        },
        {
          type: "Platform",
          props: {
            x: 200,
            y: -700,
            width: 400,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: { x: 0, y: -800, width: 100, height: 100 }
        },
        {
          type: "Platform",
          props: { x: 400, y: -800, width: 100, height: 100 }
        },
        {
          type: "Platform",
          props: {
            x: 100,
            y: -800,
            width: 400,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: {
            x: 0,
            y: -900,
            width: 300,
            height: 10,
            passthrough: true
          }
        },
        {
          type: "Platform",
          props: { x: 300, y: -900, width: 100, height: 100 }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 200,
            y: -430,
            width: 100,
            height: 10,
            xEnd: 400,
            yEnd: -430,
            speed: 100
          }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 700,
            y: -400,
            width: 80,
            height: 30,
            xEnd: 700,
            yEnd: -100,
            speed: 100,
            passthrough: true
          }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 0,
            y: -200,
            width: 200,
            height: 50,
            xEnd: 30,
            yEnd: 400,
            speed: 100
          }
        },
        {
          type: "Platform",
          props: { x: 800, y: -500, width: 500, height: 10 }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 950,
            y: -800,
            width: 50,
            height: 200,
            xEnd: 950,
            yEnd: -700,
            speed: 200
          }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 1050,
            y: -800,
            width: 50,
            height: 200,
            xEnd: 1050,
            yEnd: -700,
            speed: 200
          }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 1150,
            y: -800,
            width: 50,
            height: 200,
            xEnd: 1150,
            yEnd: -700,
            speed: 200
          }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 100,
            y: -600,
            width: 100,
            height: 100,
            xEnd: 300,
            yEnd: -600,
            speed: 100
          }
        },
        {
          type: "MovingPlatform",
          props: {
            x: 850,
            y: -400,
            width: 150,
            height: 10,
            xEnd: 1250,
            yEnd: -400,
            speed: 200
          }
        }
      ],
      ennemies: [
        { type: "Ennemy", props: { x: 450, y: -650 } },
        { type: "Ennemy", props: { x: 120, y: -750 } },
        { type: "Ennemy", props: { x: 900, y: -700 } },
        { type: "Ennemy", props: { x: 1250, y: -700 } },
        { type: "Ennemy", props: { x: 320, y: -970 } },
        { type: "Ennemy", props: { x: 900, y: -300 } },
        { type: "Ennemy", props: { x: 850, y: -300 } },
        { type: "Ennemy", props: { x: 950, y: -300 } },
        { type: "Ennemy", props: { x: 300, y: -250 } },
        { type: "Ennemy", props: { x: 300, y: 250 } },
        { type: "Ennemy", props: { x: 20, y: -100 } },
        { type: "Ennemy", props: { x: 650, y: -500 } }
      ],
      skills: [
        {
          type: "SkillHtml",
          props: {
            x: 350,
            y: -570,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillCss",
          props: {
            x: 500,
            y: -600,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillJquery",
          props: {
            x: 1000,
            y: -600,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillMongo",
          props: {
            x: 200,
            y: 0,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillReact",
          props: {
            x: 500,
            y: -200,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillAngular",
          props: {
            x: 1300,
            y: -600,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillMeteor",
          props: {
            x: 10,
            y: -880,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillSass",
          props: {
            x: 830,
            y: 50,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillBootstrap",
          props: {
            x: 20,
            y: -350,
            width: 50,
            height: 50
          }
        },
        {
          type: "SkillNode",
          props: {
            x: 1000,
            y: -450,
            width: 50,
            height: 50
          }
        }
      ]
    }
  }
};
