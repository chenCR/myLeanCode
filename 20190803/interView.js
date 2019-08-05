// this相关
/**
 * 1.1
 * obj, 实际上等于obj.show.call(obj),所以是obj
 */
function show() {
  console.log("this:", this);
}
var obj = {
  show: show
};
obj.show();

/**
 * 1.2
 * window, 因为在obj.show内运行了最外层的show方法，
 * show挂在window下，所以此时的this指向的是window
 */
function show() {
  console.log("this", this);
}
var obj = {
  show: function() {
    show();
  }
};
obj.show();

/**
 * 1.3
 * (0, obj.show),逗号表达式，返回最后一项，这里返回的是show
 * 的function，然后再执行的话show挂在window下了，
 * 所以此时的this指向的是window
 */
var obj = {
  show: function() {
    console.log("this", this);
  }
}(0, obj.show)();

/**
 * 1.4
 * 同1.1原理，所以指向的是obj.sub
 */
var obj = {
  sub: {
    show: function() {
      console.log("this:", this);
    }
  }
};
obj.sub.show();

/**
 * 1.5
 * new 操作符指向了实际上new出来的实例对象，
 * 因为new操作符内部实际上是创建了一个新对象进行返回，
 * 所以此时this绑定再返回的新对象上，
 * 所以可以理解为new 出来的实例对象
 */
var obj = {
  show: function() {
    console.log("this:", this);
  }
};
var newobj = new obj.show();

/**
 * 1.6
 * new的优先级高于bind，所以最终指向new出来的实例对象
 */
var obj = {
  show: function() {
    console.log("this:", this);
  }
};
var newobj = new (obj.show.bind(obj))();

/**
 * 1.7
 * elem.addEventListener('click', obj.show);指向到了绑定了该函数的元素上
 * elem.addEventListener('click', obj.show.bind(obj));，强行将this绑定到了obj上
 * elem.addEventListener('click', function () {
    obj.show();
    });
    指向了obj上，最终运行的那里的，而不是定义时的
 */
var obj = {
  show: function() {
    console.log("this:", this);
  }
};
var elem = document.getElementById("book-search-results");
elem.addEventListener("click", obj.show);
elem.addEventListener("click", obj.show.bind(obj));
elem.addEventListener("click", function() {
  obj.show();
});

// 作用域相关
/**
 * 2.1
 * 在showPerson运行时候，又重新定义了一个变量 person
 * 所以打印出来的是运行的时候重新定义了的person
 * 如果最外层的person改成了 const去定义，则会报错，
 * 此时的person就会为常量，无法覆盖
 */
var person = 1;

function showPerson() {
  var person = 2;
  console.log(person);
}
showPerson(); // 1

/**
 * 2.2
 * var变量进行了提升，实际上的顺序是：
 * var person = undefined -> console -> person = 2
 * 所以再console的时候person = undefined
 * 假如是使用let、const声明则会暂时性死区，报错
 */
var person = 1;

function showPerson() {
  console.log(person); // undefined
  var person = 2;
}
showPerson();

/**
 * 2.3
 * 函数优于变量声明提升
 */
var person = 1;

function showPerson() {
  console.log(person); // person函数
  var person = 2;

  function person() {}
}
showPerson();

/**
 * 2.4 
 * 第一个for循环打印出每一个的i
 * 第二个for循环涉及到事件循环机制，setTimeout是异步函数
   会先进行把for循环进行完毕，每次你循环的时候会，setTimeout就会进去调用栈
   等待for循环结束后，再回到对应调用栈去查看对应的是否执行完毕，未完毕继续执行
   所以会是10 - 10 
 * 第三个是，立即执行函数中的i就保存在每一次循环生成的立即执行函数中的作用域里了。
 * 第四个是因为，let会创建一个块级作用域，函数体内都有效
 * 第五个是因为，传入了具名函数以及传入了setTimeout的第三个参数进去
 */
for (var i = 0; i < 10; i++) {
  console.log(i); // 0-9
}
for (var i = 0; i < 10; i++) {
  setTimeout(function() {
    console.log(i); // 10 - 10
  }, 0);
}
for (var i = 0; i < 10; i++) {
  (function(i) {
    setTimeout(function() {
      console.log(i); // 0-9
    }, 0);
  })(i);
}
for (let i = 0; i < 10; i++) {
  console.log(i); // 0-9
}
for (var i = 0; i < 10; i++) {
  setTimeout(
    function timer() {
      console.log(i); // 0-9
    },
    0,
    i
  );
}

/**
 * 3.1
 */
function Person() {
  this.name = 1;
  return {};
}
var person = new Person();
console.log("name:", person.name);
