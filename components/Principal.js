import { Popup, Root } from 'popup-ui'
import React from 'react'
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
const left_image = require('./images/left.png')
const right_image = require('./images/right.png')
const empty_image = require('./images/empty.png')
const ball_image = require('./images/ball.png')

console.disableYellowBox = true;

var level1 = [];
var level2 = [];
var level3 = [];
var levels = [level1, level2, level3];
var indexLevel = 0;
var stage = 1;
const initCase = [{ x: 0, y: 2 }, { x: 0, y: 5 }];
const initDirection = ['right', 'left'];
var initPosition;
var next = { x: 0, y: 0 };
const ballCount = 11;
const successMax = 8;
const columnCount = 8;
var successCount = 0;
var rowSuccess = new Array(8).fill(false);
var credits = [];
var targetLine = [];
var creditsPosition = [];
var successBalPosition = new Array(8).fill(undefined);
var successAnimations = new Array();
var creditItem = 0;
var stopAnimation = false;
var stopAll = false;
var rowCreditHeight = 0;
var caseLeftRightx = [];
var currentCredit = { x: 0, y: 0 };
var start = false;
var currentLevel = level1;
var top = 0;

class Principal extends React.Component {
  constructor(props) {
    super(props)
    this.initLevel();
    this.state = this.getInitialState();
    global.lock = false;
    credits = [];
    global.winner = false;
    start = false;
    global.currentCase = { x: 0, y: 2 };
    global.nextCase = { x: 0, y: 0 };
    const win = Dimensions.get('window');
    global.widthImage = win.width / 8;
    global.diff = global.widthImage - global.widthImage;
    global.widthBall = global.widthImage / 3;
    //console.log('global.widthBall : ', global.widthBall);
    this.startBallLeft = (3 * (global.widthImage)) - (global.widthBall / 2) + global.diff + 1;
    //console.log('global.widthImage : ', global.widthImage);
    //console.log('startBallLeft : ', startBallLeft);
    global.position = currentCredit;
    this.initPositions();
    this.jump = (global.widthImage / 2);
    //this.jump  = (Math.sqrt(global.widthImage * global.widthImage * 2) / 2) ;
    global.jumpCount = 0;
    global.failCount = 0;
    global.stepCount = 0;
    //console.log('this.jump: ', this.jump);
    //this.moveAnimation = new Animated.ValueXY({ x: global.position.x, y: global.position.y });
    this.moveAnimation = currentCredit;
    //console.log('start ball : ', this.moveAnimation);
    this.creditAnimation = new Animated.ValueXY({ x: 0, y: 0 });
    this.currentAnimation = new Animated.ValueXY({ x: 0, y: 0 });
    //this.initJump();
    this.addCredits();
    //console.log('credits : ', credits);
    this.setState({ credits: credits });
    this.setState({ creditsPosition: creditsPosition });

    //this.addTargetLine();
    caseLeftRightx[0] = -(global.widthImage * 2) - 2;
    caseLeftRightx[1] = global.widthImage * 2;
    top = global.widthBall / 3;
  }
  randomValue() {
    const min = 0;
    const max = 2;
    const rand = min + Math.random() * (max - min);
    //console.log('rand : ', rand);
    if (rand <= 1) {
      return right_image;
    } else {
      return left_image;
    }
  }

  creditStyle = function (options) {
    return {
      position: 'absolute',
      borderWidth: 0.5,
      width: global.widthBall,
      height: global.widthBall,
      backgroundColor: 'transparent',
      borderRadius: 10,
      //opacity: this.state.fadeAnim,
      zIndex: 20,
      //backgroundColor:'red',

    }
  }

  addCredits = () => {
    for (let i = 0; i < ballCount; i++) {
      let creditAnimation = new Animated.ValueXY({ x: 0, y: 0 });
      creditsPosition[i] = creditAnimation;
      credits.push(
        <Animated.Image key={i} style={[this.creditStyle(), creditAnimation.getTranslateTransform()]} source={ball_image} onLayout={event => {
          const layout = event.nativeEvent.layout; //console.log('layout: ', layout);
        }} />);

    }
  }

  addTargetLine = () => {
    targetLine = [];
    for (let i = 0; i < columnCount; i++) {
      targetLine.push(
        <View style={styles.square} key={i}>
          <Image source={empty_image} style={{ height: global.widthImage, width: global.widthImage }} />
        </View>
      )
        ;
    }
  }

  initPositions = () => {
    global.initialPositionLeft = { x: -global.widthImage, y: -2 };
    global.initialPositionRight = { x: 2 * global.widthImage, y: -2 };
    initPosition = [global.initialPositionLeft, global.initialPositionRight];
  }
  getInitialState = () => ({

    matrix: levels[indexLevel],
    score: ballCount,
    //nextPosition : new Animated.ValueXY({ x: global.position.x - this.jump, y: global.position.y + this.jump }),
    positions: [[empty_image, empty_image, left_image, right_image, right_image, left_image, empty_image, empty_image],
    [empty_image, right_image, right_image, left_image, left_image, left_image, right_image, empty_image],
    [left_image, left_image, right_image, left_image, right_image, right_image, right_image, right_image],
    [right_image, right_image, right_image, left_image, left_image, left_image, right_image, right_image],
    [left_image, right_image, left_image, right_image, right_image, right_image, right_image, right_image],
    [left_image, left_image, left_image, right_image, right_image, right_image, right_image, left_image],
    [left_image, right_image, left_image, right_image, right_image, right_image, right_image, right_image],
    [empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image]],
    currentCase: { x: 0, y: 2 },
    currentDirection: 'right',
    credits: [],
    creditsPosition: [],
    rowSuccess: new Array(8).fill(false),
    //fadeAnim: new Animated.Value(0),
    //[[undefined, undefined, new Animated.ValueXY({ x: global.positionX - global.jump , y: global.positionY +  global.jump}, new Animated.ValueXY({ x: 0, y: 0 }, new Animated.ValueXY({ x: 0, y: 0 },new Animated.ValueXY({ x: 0, y: 0 }, undefined, undefined]],

  }
  )


  initJump() {

    var jumpingX = this.jump;
    var jumpingY = this.jump;
    //console.log('init hump: ', global.position.x);
    var startX = global.position.x;
    var startY = global.position.y;
    //console.log('jumpingX: ', jumpingX);
    //console.log('jumpingY: ', jumpingY);
    for (var i = 0; i < 8; i++) {
      startY = startY + jumpingY;
      for (var j = 0; j < 8; j++) {
        if (this.state.matrix[i][j] == empty_image) {
          this.state.positions[i][j] = new Animated.ValueXY();
        } else if (this.state.matrix[i][j] == left_image) {
          this.state.positions[i][j] = new Animated.ValueXY({ x: global.position.x - ((i + 1) * jumpingX), y: startY });
        } else if (this.state.matrix[i][j] == right_image) {
          this.state.positions[i][j] = new Animated.ValueXY({ x: global.position.x + ((i + 1) * jumpingX), y: startY });
        }

      }
      jumpingX = jumpingX + this.jump;
      jumpingY = jumpingY + this.jump;
    }
    //console.log('positions: ', this.state.positions);
  }

  showImage = (i, j) => {
    if (this.state.matrix[i][j] == empty_image) {
      return (<View style={styles.square} key={(i + 1) * (j + 9)}
        onLayout={event => {
          const layout = event.nativeEvent.layout; global.opacityWidth = layout.width; global.opacityHeight = layout.height;
        }}>
        <Image source={this.state.matrix[i][j]} style={{ height: global.widthImage, width: global.widthImage, backgroundColor: 'transparent' }}
          onLayout={event => { const layout = event.nativeEvent.layout; }} />
      </View>);
    } else {
      return (<TouchableOpacity activeOpacity={.9} onPress={this.imageClick.bind(this, i, j)} style={styles.square} key={(i + 1) * (j + 9)}
        onLayout={event => {
          const layout = event.nativeEvent.layout; global.opacityWidth = layout.width; global.opacityHeight = layout.height;
        }}>
        <Image source={this.state.matrix[i][j]} style={{ height: global.widthImage, width: global.widthImage }}
          onLayout={event => { const layout = event.nativeEvent.layout; }} />
      </TouchableOpacity>);
    }
  }

  imageClick = (i, j) => {
    //console.log('i :', i);
    //console.log('j :', j);

    if (start == true) {
      var currentCase = initCase[global.stepCount % 2];
      let matrix = this.state.matrix;

      //console.log('x :', currentCase.x);
      //console.log('y :', currentCase.y);
      //console.log('matrix[i][j] :', matrix[i][j]);
      /*if(global.jumpCount > 0 && global.isPaire &&  i == currentCase.x && j == currentCase.y && global.lock == true) {
         console.log('case blocked.....');
      } else*/
      {
        if (matrix[i][j] === left_image) {
          matrix[i][j] = right_image;
          this.setState({ matrix: matrix });
        } else if (matrix[i][j] === right_image) {
          this.setState({ matrix: matrix });
          matrix[i][j] = left_image;
        }

      }
    }
  }



  startGame = () => {
    if (start == true) {
      return;
    }
    start = true;
    //console.log('starting level.............................');
    creditItem = 0;
    stopAnimation = false;
    global.currentCase = { x: 0, y: 2 };
    //console.log('setState currentcase start game: ', global.currentCase);
    this.setState({ currentCase: global.currentCase });

    this.moveCredit();
  }
  go = () => {
    start = true;
    this._moveBall();
  }

  initLevel() {
    switch (indexLevel) {
      case 0:
        var level = [[empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), empty_image, empty_image],
        [empty_image, this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), empty_image],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image]];
        break;
      case 1:
        var level = [[empty_image, empty_image, this.randomValue(), empty_image, empty_image, this.randomValue(), empty_image, empty_image],
        [empty_image, this.randomValue(), this.randomValue(), empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue()],
        [empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image]];
        break;
      case 2:
        var level = [[empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), empty_image, empty_image],
        [empty_image, this.randomValue(), this.randomValue(), empty_image, empty_image, this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue(), this.randomValue()],
        [empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image],
        [empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image]];
        break;
    }
    //console.log('level : ', level);
    levels[indexLevel] = level;
  }
  initGame = () => {
    this.initLevel();
    this.currentAnimation.stopAnimation();
    //let score = this.state.score;
    console.log('smak matrix', this.state.matrix);
    //console.log('initgame ', score);
    this.state.matrix[7] = [empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image, empty_image];
    start = false;
    global.winner = false;
    this.setState(this.getInitialState());
    //this.state = {matrix : matrix, positions : positions, currentCase: currentCase, currentDirection: currentDirection, credits: credits, creditsPosition:creditsPosition};
    this.state = { score: ballCount };
    //this.addTargetLine();
    //console.log('targetLine : ', targetLine);
    //console.log('initgame ', score);
    //console.log("smak score: ", score);
    //this.initStep();
    global.failCount = 0;
    global.jumpCount = 0;
    global.stepCount = 0;
    creditItem = 0;
    successCount = 0;
    //this.initPositions();
    next = initPosition[global.stepCount % 2];
    //console.log('global.stepCount : ', global.stepCount % 2);
    //console.log('initCase : ', initCase[global.stepCount % 2]);
    //console.log('initDirection : ', initDirection[global.stepCount % 2]);
    this.setState({ currentCase: initCase[global.stepCount % 2], currentDirection: initDirection[global.stepCount % 2] });

    credits = [];
    this.setState({ credits: credits });
    //console.log('init credits: ', credits);

    creditItem = 0;
    rowSuccess = new Array(8).fill(false);
    //score = ballCount;
    this.addCredits();
    stopAnimation = true;
    //this.setState({score: score});
    //this.setState({ fadeAnim: new Animated.Value(0) });
    //console.log('fadeAnim : ', fadeAnim);
    this.startGame();
    //this.startGame();

  }
  initStep = () => {
    this.initBall();


  }
  initBallAfterFail = () => {
    //console.log('initBallAfterFail....', rowSuccess);
    //let score = this.state.score;
    stopAnimation = false;

    //score--;
    //console.log('ball failed');
    this.initBall();
    //this.setState({score: score});
  }

  initBallAfterSuccess = () => {
    this.initBall();
    //this.setState({rowSuccess: rowSuccess});
  }

  initBall() {
    global.failCount++;
    global.jumpCount = 0;
    global.stepCount++;

    //global.initPosition[0] = global.initialPositionLeft;
    //global.initPosition[1] = global.initialPositionRight;
    this.initPositions();
    next = initPosition[global.stepCount % 2];

    //console.log('init next: ', next);
    //console.log('initPosition: ', initPosition);
    //console.log('global.stepCount: ', global.stepCount);
    //currentCase = initCase[global.stepCount % 2];
    //console.log('setState currentcase init ball: ', initCase[global.stepCount % 2]);
    //console.log('setState currentcase init ball: ', global.stepCount );
    this.setState({ currentCase: initCase[global.stepCount % 2], currentDirection: initDirection[global.stepCount % 2] });
    //this.setState({ currentDirection : initDirection[global.stepCount % 2] });
  }
  gameOver = () => {
    this.animationRestartLevel();
    Popup.show({
      type: 'Danger',
      title: 'Madamir',
      button: true,
      textBody: 'Partie ratée! ',
      buttonText: 'Rejouer!',
      callback: () => {
        Popup.hide(); indexLevel = 0; stage = 1;
        setTimeout(() => {
          console.log(" 2 seconds have passed!");
          // Your code to execute after 5 seconds
        }, 5000);
        //this.animationRestartLevel();

        this.initGame();

        //this.setState({ rowSuccess: new Array(7).fill(false) });
      }
    })
  }

  levelSuccess = () => {
    if (levels.length == stage) {
      Popup.show({
        type: 'Success',
        title: 'Madamir',
        button: true,
        textBody: 'Félicitation, vous avez gagné toutes les parties',
        buttonText: 'Rejouer',
        callback: () => {
          Popup.hide(); indexLevel = 0; stage = 1; this.initGame();;
        }
      })
    } else {
      Popup.show({
        type: 'Success',
        title: 'Madamir',
        button: true,
        textBody: 'Félicitation, vous avez gagné la partie',
        buttonText: 'Suivant',
        callback: () => {
          this.animationRestartLevel();
          Popup.hide(); indexLevel++; stage++; this.initGame();;
        }
      })
    }
  }
  animationSuccess = (column) => {
    var toValue = 0;
    if (successBalPosition[column] == undefined) {
      let toy = - top + (global.widthImage / 2);
      //console.log('tox : ', tox);
      toValue = { x: next.x, y: next.y + toy };
      successBalPosition[column] = toValue;
    } else {
      //console.log('already exist');
      toValue = successBalPosition[column];
    }

    //console.log('successBalPosition : ', successBalPosition);
    successAnimations.push(this.currentAnimation);
    console.log('successAnimations length', successAnimations.length, successAnimations);
    console.log('successAnimations', this.successAnimations);
    Animated.timing(this.currentAnimation, {

      toValue: { x: toValue.x, y: toValue.y },
      delay: 0,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.bounce,
      //easing: Easing.elastic(2)
    }).start(() => {
    })
  }

  animationRestartLevel = () => {
    console.log('successBalPosition', successAnimations.length, successAnimations);
    for (let i = 0; i < successAnimations.length; i++) {

      if (successAnimations[i] != undefined) {
        let animate = successAnimations[i];
        console.log('successAnimations[' + i + ']: ', animate);

        Animated.spring(animate, {

          toValue: { x: 6000, y: 6000 },
          delay: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.bounce,
          //easing: Easing.elastic(2)
        }).start(() => {
        })
      }
    }

    /*if (successBalPosition[1] == undefined) {
      animation = successBalPosition[1];
      animation.

    

    Animated.bounce(this.animation, {
      toValue: { x: 0, y: 0 },
      delay: 0,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.bounce,
      //easing: Easing.elastic(2)
    }).start(() => {
    })
  }*/
  }

  moveCredit = () => {
    //console.log('move credit : ', stopAnimation);
    if (start == false) {
      return;
    }

    var score = this.state.score;

    if (score > 0) {
      score--;
    }
    //console.log('move credit score : ', score);
    this.setState({ score: score });
    //console.log('creditsPosition: ', creditsPosition);
    this.currentAnimation = creditsPosition[creditItem];
    //console.log('creditItem:', creditItem);
    //var next = this.moveAnimation;
    //console.log('caseLeftRightx: ', caseLeftRightx);
    //var x = caseLeftRightx[creditItem % 2]-rowCreditx;
    var x = caseLeftRightx[creditItem % 2];
    var y = rowCreditHeight - global.widthBall - (top);

    //console.log('x: ', x);
    //console.log('y: ', y);
    currentCredit.x = x;
    currentCredit.y = y;
    //console.log('currentCredit: ', currentCredit);
    //console.log('rowCreditHeight: ', rowCreditHeight);
    //console.log('global.heightBall: ', global.widthBall);
    Animated.timing(this.currentAnimation, {
      //toValue: this.state.nextPosition,
      toValue: { x: currentCredit.x, y: currentCredit.y },
      //toValue: {x:10, y:160},
      delay: 0,
      duration: 300,
      useNativeDriver: true,
      //easing: Easing.bounce,
      //easing: Easing.elastic(2)
    }).start(() => {
      //this.moveAnimation = currentCredit;
      //       console.log('fin move credit: ', currentCredit);
      //this.currentAnimation = new Animated.ValueXY({ x: currentCredit.x, y: currentCredit.y });
      //console.log('from credit.......................');
      this._moveBall();
    })
  }
  _moveBall = () => {
    //console.log('move ball : ', stopAnimation);
    if (start == false) {
      return;
    }

    var currentCase = this.state.currentCase;
    var currentDirection = this.state.currentDirection;
    var score = this.state.score;
    var matrix = this.state.matrix;

    //rowSuccess = this.state.rowSuccess;
    global.position = currentCredit;
    //  console.log('global.position: ', global.position);
    global.nextCase.x = currentCase.x;
    global.nextCase.y = currentCase.y;
    let nextY = 0;
    var direction;
    //    console.log('global.position.x: ', global.position.x);
    //console.log('global.jumpCount % 2: ', global.jumpCount % 2);
    //console.log('currentCase.x: ', currentCase.x);
    //console.log('currentCase.y: ', currentCase.y);
    //console.log('matrix[currentCase.x][currentCase.y] : ', matrix[currentCase.x][currentCase.y]);
    if (global.jumpCount % 2 === 1) {
      if (currentCase.x < 7) {
        //console.log('check direction .....', currentCase);
        if (matrix[currentCase.x][currentCase.y] == left_image) {
          currentDirection = 'left';
        } else if (matrix[currentCase.x][currentCase.y] == right_image) {

          currentDirection = 'right';
          //global.nextCaseX = currentCase.x + 1;
          //global.nextCaseY = currentCase.y + 1;



        }

        this.setState({ currentDirection: currentDirection });
      }
      //console.log("Mise a jour de nextCase");
      //if(currentDirection == 'left') {
      //  global.nextCase.x = currentCase.x + 1;
      //  global.nextCase.y = currentCase.y - 1;
      //} else {
      //   global.nextCase.x = currentCase.x + 1;
      //   global.nextCase.y = currentCase.y + 1;
      // }
    } else {
      //console.log('previous direction .....', currentCase);
      if ((global.jumpCount > 0)) {
        global.lock = true;
      }


    }
    //console.log('this.jump: ', this.jump);
    //console.log('currentCredit', currentCredit);
    //console.log('next ', next);
    if (currentCase.x < 7) {
      if (currentDirection === 'left') {
        //     console.log('left direction ......');
        this.direction = 'left';
        //   console.log('this.jump: ', this.jump);
        //  console.log('currentCredit.x: ', currentCredit.x);
        //  console.log('currentCredit.y: ', currentCredit.y);
        next.x = currentCredit.x - (this.jump);
        next.y = currentCredit.y + this.jump;

        //console.log('next : ', next);
      } else if (currentDirection === 'right') {
        //console.log('right direction ......');
        this.direction = 'right';
        next.x = currentCredit.x + (this.jump);
        next.y = currentCredit.y + this.jump;
      }
    }

    //let toX = this.state.nextPosition.x;
    //let toY = this.state.nextPosition.y;
    //toX++;toY++;
    //console.log('this.moveAnimation : ', this.moveAnimation);
    //console.log('next.x: ', next.x);
    //console.log('next.y: ', next.y);
    // if(stopAnimation == true) {
    //      console.log('vertical animation................');
    //      this._moveSuccessBall();
    //} else
    //this.moveAnimation = currentCredit;
    //console.log('this.moveAnimation: ', this.currentAnimation);
    Animated.timing(this.currentAnimation, {
      //toValue: this.state.nextPosition,
      toValue: { x: next.x, y: next.y },
      //toValue: {x: -1.1666770703864842, y:111.28787948146011},
      delay: 0,
      duration: 400,
      useNativeDriver: true,
      //easing: Easing.bounce,
      //easing: Easing.elastic(2)
    }).start(() => {
      matrix = this.state.matrix;
      var failed = false;
      var success = false;
      var resetBall = false;


      if (currentCase.y < 0 || currentCase.y > 7) {
        //console.log('outof range ...... ', currentCase);
        failed = true;
        resetBall = true;
        stopAnimation = true;
        //this.initBallAfterFail();
      } else if (currentCase.x == 7) {
        // success
        success = true;
        successCount++;
        resetBall = true;
        //console.log('case 7 .............................');
        //console.log('move animation : ', currentCase.y);
        //console.log('next : ', next);
        stopAnimation = true;
        rowSuccess[currentCase.y] = true;
        this.animationSuccess(currentCase.y);
        //console.log('add success : ', currentCase.y);
        //this.initBallAfterSuccess();

      }
      if (global.jumpCount % 2 == 1) {
        //console.log('after move :', currentCase);
        if (currentCase.x < 7) {
          if (matrix[currentCase.x][currentCase.y] == left_image && matrix[currentCase.x][currentCase.y - 1] == right_image) {
            matrix[currentCase.x][currentCase.y] = empty_image;
            matrix[currentCase.x][currentCase.y - 1] = empty_image;
            //     console.log('cassage left right : ', currentCase);
            failed = true;

            //this.setState({ matrix });
          } else
            if (matrix[currentCase.x][currentCase.y] == right_image && matrix[currentCase.x][currentCase.y + 1] == left_image) {
              matrix[currentCase.x][currentCase.y] = empty_image;
              matrix[currentCase.x][currentCase.y + 1] = empty_image;
              //        console.log('cassage right left: ', currentCase);
              //next = global.initialPositionLeft;
              failed = true;

              //this.setState({ matrix });
            }

          //console.log('failed .....', failed)
          if (failed == true) {
            resetBall = true;
            //console.log('stopping .....')
            //Animated.timing(this.currentAnimation).stop();
            //this.initBallAfterFail();
            stopAnimation = true;
            //if(global.failCount % 2 == 0) {
            //    next = global.initialPositionLeft;
            //} else {
            //    next = global.initialPositionRight;
            //}
            //console.log('next : ',next);
            //console.log('global.initialPositionLeft : ',global.initialPositionLeft);
          } else {
            //global.currentCase = global.nextCase;
            // vérifier le voisin
            //console.log('vérification de voisin : ', currentCase);
            if (currentDirection == 'left' && currentCase.y > 0 && matrix[currentCase.x][currentCase.y - 1] == right_image) {
              //       console.log('change to voisin right: ', matrix[currentCase.x][currentCase.y-1]);
              //     console.log('change to currentCase.y: ', currentCase.y-1);
              currentDirection = 'voisin-right';
            } else if (currentDirection == 'right' && currentCase.y < 7 && matrix[currentCase.x][currentCase.y + 1] == left_image) {
              //console.log('change to voisin left: ', matrix[currentCase.x][currentCase.y+1]);
              //        console.log('currentCase: ', currentCase.y);
              currentDirection = 'voisin-left';
            }

            if (currentDirection == 'voisin-right' || currentDirection == 'voisin-left') {
              global.nextCase.x = currentCase.x + 1;
            } else
              if (currentDirection == 'left') {
                global.nextCase.x = currentCase.x + 1;
                global.nextCase.y = currentCase.y - 1;
              } else {
                global.nextCase.x = currentCase.x + 1;
                global.nextCase.y = currentCase.y + 1;
              }
            if (currentDirection == 'voisin-right') {
              currentDirection = 'right';
            } else if (currentDirection == 'voisin-left') {
              currentDirection = 'left';
            }
            //console.log('setState currentcase : ', global.nextCase);
            this.setState({ currentDirection: currentDirection });
            //console.log("Mise a jour de nextCase: ", global.nextCase);
            this.setState({ currentCase: { x: global.nextCase.x, y: global.nextCase.y } });
          }

        }
      }
      if (resetBall == false) {
        global.jumpCount++;
      }
      //  console.log('next case x: ',global.nextCase.x);
      // console.log('next case y: ',global.nextCase.y);
      //this.currentAnimation = new Animated.ValueXY({ x: next.x, y: next.y });
      global.position.x = next.x;
      global.position.y = next.y;
      //console.log('move to : ', this.moveAnimation);
      //this._moveBall();
      var totalSuccess = 0;
      let reste = ballCount - successMax;
      //console.log('ballCount: ', ballCount);
      //console.log('successMax: ', successMax);
      //console.log('score: ', score);
      if (score <= reste) {
        for (let i = 0; i < successMax; i++) {
          if (rowSuccess[i] == true) {
            totalSuccess++;
          }
        }
        //console.log('rowSuccess: ', rowSuccess);
      }
      if (totalSuccess == successMax) {
        console.log('level success');
        this.levelSuccess();
        stopAnimation = true;
      } else

        if (stopAnimation == true) {
          //stopAnimation = true;
          if (failed == true) {
            //console.log('credit remove', successCount);
            credits.splice(successCount, 1);
            //console.log('new credits : ', credits);
          }
          //console.log('credits: ', credits.length);
          creditItem++;
          if (creditItem < ballCount) {
            this.initBallAfterFail();
            this.moveCredit();
          } else {
            // game over
            console.log('game over');
            this.gameOver();
          }

        } else {
          //console.log('recursive.......................');
          if (start == true) {
            this._moveBall();
          }

        }
    });

    //this.moveAnimation = this.state.nextPosition;
    //var nextX = toX - global.jump;
    //var nextY = toY + global.jump;
    // this.setState({nextPosition : { x: nextX, y: nextY } });
  }

  render() {

    //const {score} = this.state.score;

    //rowSuccess = this.state.rowSuccess;
    //for(let i = 0; i < ballCount; i++){
    //   	credits.push(
    //
    //				<Animated.Image style={[styles.credit_ball_style, this.moveAnimation.getLayout()]} source={ball_image} onLayout={event => {
    //                   const layout = event.nativeEvent.layout;
    //                 }}>
    //           </Animated.Image>


    //	)
    //}

    return (
      <Root>
        <View style={styles.container_global_style} onLayout={event => {
          const layout = event.nativeEvent.layout;

        }}>

          <Text style={styles.score_text_style}>Partie : {stage}</Text>
          <Text style={styles.score_text_style}>Balles restantes : {this.state.score}</Text>

          <View style={styles.credit_style} onLayout={event => {
            const layout = event.nativeEvent.layout; //console.log('row credit: ', layout);
            rowCreditHeight = layout.height;
          }}>
            {credits}
          </View>

          <View style={styles.images_style}>
            {
              this.state.matrix.map((row, i) =>
                <View style={styles.matrix_line_style} key={i} onLayout={event => { const layout = event.nativeEvent.layout; }}>
                  {row.map((col, j) => this.showImage(i, j)
                  )}
                </View>)
            }

          </View>
          <View style={styles.action_style}>
            <TouchableOpacity style={styles.container_action_style} activeOpacity={.5} onPress={this.startGame}>
              <Text style={styles.button_style}> Démarrer </Text>
            </TouchableOpacity>
          </View>

        </View>
      </Root >
    );
  }
}


var styles = StyleSheet.create(
  {
    container_global_style:
    {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
      paddingBottom: 10,
      marginLeft: 5,
      marginRight: 5,
    },
    images_style:
    {
      marginLeft: 5,
      marginRight: 5,
    },
    score_text_style:
    {
      flex: 0.5,
      fontSize: 20,
      fontWeight: "bold",
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      //color:'#4faef4',
      //backgroundColor:'red',
    },
    credit_style:
    {

      flex: 1,
      flexDirection: 'row',
      //alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
      zIndex: 10,

    },
    credit_container_style:
    {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    matrix_line_style:
    {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'black',
      backgroundColor: 'transparent',
      marginTop: 0,


    },
    matrix_line_target_style:
    {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      marginTop: 0,

    },
    container_ball_style: {
      //position: 'absolute',
      //zIndex: 900,
      //top: global.position.y,
      //left: global.position.x,
      width: global.widthBall,
      height: global.widthBall,
      //backgroundColor:'red',
    },
    container_ball_success_style: {
      //position: 'absolute',
      //zIndex: 900,
      //top: (-global.widthImage  / 2) -(global.widthBall /2) ,
      //left: (global.widthImage ) / 2 - (global.widthBall/2),
      //left: 0,
      width: global.widthBall,
      height: global.widthBall,
      //backgroundColor:'red',
    },
    matrix_style:
    {
      flex: 4,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
      //backgroundColor:'green',

    },
    square: {
      borderWidth: 0.6,
      //backgroundColor:'red',
      backgroundColor: 'transparent',
    },
    action_style: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    column:
    {
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container:
    {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    text:
    {
      fontSize: 20,
      fontWeight: "bold",
    },
    button_style:
    {
      fontSize: 20,
      color: "white",
      fontWeight: "bold",
      marginLeft: 10,
      marginRight: 10,
    },
    container_action_style: {
      marginTop: 10,
      paddingTop: 10,
      paddingBottom: 10,
      marginLeft: 30,
      marginRight: 30,
      backgroundColor: '#4faef4',
      borderRadius: 30,
      borderWidth: 1,
      borderColor: '#fff'
    },
    ball_style: {
      //top: 0,
      //left: 0,
      width: global.widthBall,
      height: global.widthBall
    },
    credit_ball_style: {
      position: 'absolute',
      borderWidth: 0.5,
      width: global.widthBall,
      height: global.widthBall,
      //width : 16.03030303030303,
      //height : 16.03030303030303,
      zIndex: 20,
      backgroundColor: 'red',
      //zIndex: 2,
    },
  });
export default Principal
