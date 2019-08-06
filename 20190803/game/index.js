(function() {
  function prepare() {
    const imgTask = (img, src) => {
      return new Promise(function(resolve, reject) {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };
    const canvas = document.getElementById("content");
    const context = canvas.getContext("2d");
    const heroImg = new Image();
    const allSpriteImg = new Image();
    const allresourceTask = Promise.all([
      imgTask(heroImg, "./hero.png"),
      imgTask(allSpriteImg, "./all.jpg")
    ]);
    return {
      /**
       * @param {Function} [callback] - 当准备好了之后要调用的回掉函数
       */
      getResource(callback) {
        allresourceTask.then(function() {
          callback && callback(context, heroImg, allSpriteImg);
        });
      }
    };
  }
  // 绘制英雄
  function drawHero(context, heroImg, allSpriteImg) {
    var draw = function() {
      this.context.drawImage(
        this.img,
        this.imgPos.x,
        this.imgPos.y,
        this.imgPos.width,
        this.imgPos.height,
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
    };
    // 键盘控制事件
    var move = function(target) {
      const that = this;
      const canvas = document.getElementById("content");
      const canvasW = canvas.width;
      const canvasH = canvas.height;
      window.addEventListener(
        "keydown",
        function(event) {
          var keyID = event.keyCode ? event.keyCode : event.which;
          const keyArr = [38, 39, 40, 37];
          if (!hitBox(that, target)) {
            alert("已死亡，请重新开始");
            window.location.reload();
          } else {
            if (keyArr.indexOf(keyID) > -1) {
              debounce(function() {
                clearCanvas();
                target.draw();
              }, 300);
              event.preventDefault();
            }
            // 上右下左
            switch (true) {
              case keyID === 38:
                if (that.rect.y - 10 >= 0) {
                  that.rect.y = that.rect.y - 10;
                }
                break;
              case keyID === 39:
                if (that.rect.x + 10 <= canvasW - that.rect.width) {
                  that.rect.x = that.rect.x + 10;
                }
                break;
              case keyID === 40:
                if (that.rect.y + 10 <= canvasH - that.rect.height) {
                  that.rect.y = that.rect.y + 10;
                }
                break;
              case keyID === 37:
                if (that.rect.x - 10 >= 0) {
                  that.rect.x = that.rect.x - 10;
                }
                break;
            }
          }
        },
        true
      );
      window.addEventListener(
        "keyup",
        function(event) {
          debounce(function() {
            that.draw();
            target.draw();
          }, 300);
        },
        true
      );
    };
    // 碰撞检测
    var hitBox = function(source, target) {
      /* 源物体和目标物体都包含 x, y 以及 width, height */
      return (
        source.rect.y + source.rect.height < target.rect.y ||
        source.rect.y > target.rect.y + target.rect.height ||
        source.rect.x + source.rect.width < target.rect.x ||
        source.rect.x > target.rect.x + target.rect.width
      );
    };
    // 防抖，降低性能消耗
    var debounce = function(fn, wait) {
      let timeout;
      return (function() {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
          fn.apply(this, arguments);
        }, wait);
      })();
    };

    var hero = {
      img: heroImg,
      context: context,
      imgPos: {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      },

      rect: {
        x: 0,
        y: 0,
        width: 40,
        height: 40
      },
      draw: draw,
      move: move
    };
    var monster = {
      img: allSpriteImg,
      context: context,
      imgPos: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },

      rect: {
        x: 100,
        y: 100,
        width: 40,
        height: 40
      },

      draw: draw
    };
    hero.draw();
    hero.move(monster);
    monster.draw();
  }

  // 清空画布
  function clearCanvas() {
    const canvas = document.getElementById("content");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  var resourceManager = prepare();
  resourceManager.getResource(function(context, heroImg, allSpriteImg) {
    drawHero(context, heroImg, allSpriteImg);
  });
})();
