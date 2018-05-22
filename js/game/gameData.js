var gameData = {
  constants: {
    GRAVITY_ACCELERATION: 1200
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
      }
    ]
  },
  music: {
    location: "./assets/music/",
    files: [
      {
        filename: "Star Wars - John Williams - Duel Of The Fates.mp3",
        volume: 1
      }
    ]
  },
  levels: [
    {
      name: "test level",
      cssBackground: {
        src: "./assets/images/background_1000_stars.png",
        size: "800px 600px"
      },
      worldRect: {
        type: AABB,
        options: {
          x: -1000,
          y: -2000,
          width: 5000,
          height: 8000
        }
      },
      player: {
        type: Player,
        options: {
          x: 10,
          y: -200,
          color: "red"
        }
      },
      platforms: [
        { type: Platform, options: { x: 0, y: -350, width: 200, height: 5 } },
        { type: Platform, options: { x: 350, y: -250, width: 50, height: 5 } },
        { type: Platform, options: { x: 0, y: -130, width: 180, height: 5 } },
        { type: Platform, options: { x: 0, y: -150, width: 180, height: 5 } },
        { type: Platform, options: { x: 330, y: -400, width: 150, height: 5 } },
        { type: Platform, options: { x: 150, y: 200, width: 50, height: 5 } },
        { type: Platform, options: { x: 500, y: -270, width: 80, height: 80 } },
        {
          type: Platform,
          options: { x: 500, y: -170, width: 80, height: 160 }
        },
        { type: Platform, options: { x: 500, y: 10, width: 80, height: 120 } },
        { type: Platform, options: { x: 500, y: 150, width: 80, height: 120 } },
        { type: Platform, options: { x: 700, y: -80, width: 30, height: 20 } },
        { type: Platform, options: { x: 350, y: 70, width: 30, height: 20 } },
        { type: Platform, options: { x: 700, y: 210, width: 30, height: 20 } },
        { type: Platform, options: { x: 200, y: -400, width: 5, height: 100 } },
        {
          type: Platform,
          options: { x: 0, y: -100000, width: 1, height: 200000 }
        },
        {
          type: MovingPlatform,
          options: {
            xStart: 200,
            yStart: -500,
            width: 100,
            height: 5,
            xEnd: 400,
            yEnd: -500
          }
        },
        {
          type: MovingPlatform,
          options: {
            xStart: 700,
            yStart: -400,
            width: 80,
            height: 30,
            xEnd: 700,
            yEnd: -100
          }
        }
      ],
      ennemies: []
    },
    {
      name: "level 1",
      cssBackground: {
        src: "./assets/images/background_1000_stars.png",
        size: "800px 600px"
      },
      worldRect: {
        type: AABB,
        options: {
          x: -1000,
          y: -2000,
          width: 5000,
          height: 8000
        }
      },
      player: {
        type: Player,
        options: {
          x: 100,
          y: -400,
          color: "green"
        }
      },
      platforms: [
        { type: Platform, options: { x: 0, y: -350, width: 200, height: 5 } },
        { type: Platform, options: { x: 350, y: -250, width: 50, height: 5 } },
        { type: Platform, options: { x: 0, y: -130, width: 180, height: 5 } },
        { type: Platform, options: { x: 0, y: -150, width: 180, height: 5 } },
        { type: Platform, options: { x: 330, y: -400, width: 150, height: 5 } },
        { type: Platform, options: { x: 150, y: 200, width: 50, height: 5 } },
        { type: Platform, options: { x: 500, y: -270, width: 80, height: 80 } },
        {
          type: Platform,
          options: { x: 500, y: -170, width: 80, height: 160 }
        },
        { type: Platform, options: { x: 500, y: 10, width: 80, height: 120 } },
        { type: Platform, options: { x: 500, y: 150, width: 80, height: 120 } },
        { type: Platform, options: { x: 700, y: -80, width: 30, height: 20 } },
        { type: Platform, options: { x: 350, y: 70, width: 30, height: 20 } },
        { type: Platform, options: { x: 700, y: 210, width: 30, height: 20 } },
        { type: Platform, options: { x: 200, y: -400, width: 5, height: 100 } },
        {
          type: Platform,
          options: { x: 0, y: -100000, width: 1, height: 200000 }
        }
      ],
      ennemies: []
    }
  ]
};
