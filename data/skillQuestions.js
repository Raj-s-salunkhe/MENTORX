const skillQuestions = {
  python: [
    {
      question: "Which of the following is the correct way to create a function in Python?",
      options: [
        "function myFunc():",
        "def myFunc():",
        "func myFunc():",
        "define myFunc():"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the output of: print(type([1, 2, 3]))",
      options: [
        "<class 'list'>",
        "<class 'tuple'>",
        "<class 'array'>",
        "<class 'str'>"
      ],
      correctAnswer: 0
    },
    {
      question: "Which keyword is used to handle exceptions in Python?",
      options: [
        "try",
        "except",
        "finally",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      question: "What does the 'self' parameter represent in a class method?",
      options: [
        "The class itself",
        "The instance of the class",
        "The parent class",
        "A static variable"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is NOT a Python data type?",
      options: [
        "List",
        "Dictionary",
        "Array",
        "Set"
      ],
      correctAnswer: 2
    },
    {
      question: "How do you start a comment in Python?",
      options: [
        "//",
        "/*",
        "#",
        "<!--"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the correct file extension for Python files?",
      options: [
        ".pt",
        ".py",
        ".python",
        ".pyt"
      ],
      correctAnswer: 1
    },
    {
      question: "Which method can return a string representation of an object?",
      options: [
        "toString()",
        "__str__()",
        "str()",
        "Both B and C"
      ],
      correctAnswer: 3
    },
    {
      question: "How do you create a virtual environment in Python?",
      options: [
        "python -m venv myenv",
        "python create venv",
        "venv create myenv",
        "pip install venv"
      ],
      correctAnswer: 0
    },
    {
      question: "Which of the following is used to define a block of code in Python?",
      options: [
        "Curly braces {}",
        "Parentheses ()",
        "Indentation",
        "Semicolons ;"
      ],
      correctAnswer: 2
    }
  ],
  javascript: [
    {
      question: "Which company developed JavaScript?",
      options: [
        "Microsoft",
        "Netscape",
        "Sun Microsystems",
        "IBM"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the correct way to write a JavaScript array?",
      options: [
        "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')",
        "var colors = ['red', 'green', 'blue']",
        "var colors = 'red', 'green', 'blue'",
        "var colors = (1:'red', 2:'green', 3:'blue')"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you write 'Hello World' in an alert box?",
      options: [
        "msgBox('Hello World');",
        "alertBox('Hello World');",
        "msg('Hello World');",
        "alert('Hello World');"
      ],
      correctAnswer: 3
    },
    {
      question: "How does a FOR loop start in JavaScript?",
      options: [
        "for (i = 0; i <= 5)",
        "for (i = 0; i <= 5; i++)",
        "for i = 1 to 5",
        "for (i <= 5; i++)"
      ],
      correctAnswer: 1
    },
    {
      question: "Which event occurs when the user clicks on an HTML element?",
      options: [
        "onchange",
        "onmouseclick",
        "onclick",
        "onmouseover"
      ],
      correctAnswer: 2
    },
    {
      question: "How do you declare a JavaScript variable?",
      options: [
        "variable carName;",
        "v carName;",
        "var carName;",
        "carName =;"
      ],
      correctAnswer: 2
    },
    {
      question: "Which operator is used to assign a value to a variable?",
      options: [
        "*",
        "-",
        "=",
        "+"
      ],
      correctAnswer: 2
    },
    {
      question: "What will the following code return: Boolean(10 > 9)",
      options: [
        "NaN",
        "false",
        "true",
        "0"
      ],
      correctAnswer: 2
    },
    {
      question: "How to insert a comment that has more than one line?",
      options: [
        "// This comment has more than one line //",
        "/ This comment has more than one line /",
        "/* This comment has more than one line */",
        "<!-- This comment has more than one line -->"
      ],
      correctAnswer: 2
    },
    {
      question: "Which type of JavaScript language is ___?",
      options: [
        "Object-Oriented",
        "Object-Based",
        "Assembly-language",
        "High-level"
      ],
      correctAnswer: 1
    }
  ],
  react: [
    {
      question: "What is React primarily used for?",
      options: [
        "Database management",
        "Building user interfaces",
        "Server-side scripting",
        "Network configuration"
      ],
      correctAnswer: 1
    },
    {
      question: "Which company developed React?",
      options: [
        "Google",
        "Facebook",
        "Amazon",
        "Twitter"
      ],
      correctAnswer: 1
    },
    {
      question: "What is JSX in React?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "Joint Script X",
        "Java Super X"
      ],
      correctAnswer: 0
    },
    {
      question: "How do you create a component in React?",
      options: [
        "Using the 'component' keyword",
        "By extending React.Component",
        "Using the 'createComponent' function",
        "By importing from 'react-dom'"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of the 'useState' hook in React?",
      options: [
        "To manage side effects",
        "To manage state in functional components",
        "To fetch data from API",
        "To handle routing"
      ],
      correctAnswer: 1
    },
    {
      question: "Which method is used to update state in a class component?",
      options: [
        "this.updateState()",
        "this.setState()",
        "this.changeState()",
        "this.modifyState()"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you pass data from parent to child component in React?",
      options: [
        "Using 'props'",
        "Using 'state'",
        "Using 'context'",
        "All of the above"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the virtual DOM in React?",
      options: [
        "A copy of the real DOM",
        "A lightweight copy of the DOM",
        "A database of DOM elements",
        "A template for DOM"
      ],
      correctAnswer: 1
    },
    {
      question: "Which hook is used for side effects in React?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useReducer"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you conditionally render in React?",
      options: [
        "Using if/else statements",
        "Using ternary operator",
        "Using switch case",
        "All of the above"
      ],
      correctAnswer: 3
    }
  ],
  cpp: [
    {
      question: "Who developed C++?",
      options: [
        "Dennis Ritchie",
        "Bjarne Stroustrup",
        "James Gosling",
        "Guido van Rossum"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is the correct syntax to include a header file in C++?",
      options: [
        "include <iostream.h>",
        "#include <iostream>",
        "import <iostream>",
        "require <iostream>"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the output of: cout << 5 + '2';",
      options: [
        "52",
        "7",
        "ASCII value of '2' + 5",
        "Compiler error"
      ],
      correctAnswer: 3
    },
    {
      question: "Which operator is used to allocate memory in C++?",
      options: [
        "malloc",
        "calloc",
        "new",
        "alloc"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a constructor in C++?",
      options: [
        "A function that destroys objects",
        "A special member function that initializes objects",
        "A function that deletes memory",
        "A static function"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is NOT a loop in C++?",
      options: [
        "for",
        "while",
        "do-while",
        "foreach"
      ],
      correctAnswer: 3
    },
    {
      question: "What does the 'this' pointer refer to in C++?",
      options: [
        "The class definition",
        "The current object",
        "The base class",
        "The derived class"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you declare a pointer in C++?",
      options: [
        "int* ptr;",
        "pointer int ptr;",
        "int pointer ptr;",
        "ptr int*;"
      ],
      correctAnswer: 0
    },
    {
      question: "Which of the following is used for comments in C++?",
      options: [
        "/* */",
        "//",
        "Both A and B",
        "#"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the size of int in C++ (on most systems)?",
      options: [
        "2 bytes",
        "4 bytes",
        "8 bytes",
        "Depends on compiler"
      ],
      correctAnswer: 1
    }
  ],
  java: [
    {
      question: "Who is the father of Java?",
      options: [
        "James Gosling",
        "Dennis Ritchie",
        "Bjarne Stroustrup",
        "Guido van Rossum"
      ],
      correctAnswer: 0
    },
    {
      question: "Which keyword is used to define a class in Java?",
      options: [
        "class",
        "Class",
        "def",
        "object"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the default value of a boolean variable in Java?",
      options: [
        "true",
        "false",
        "0",
        "null"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is not a Java feature?",
      options: [
        "Object-oriented",
        "Use of pointers",
        "Portable",
        "Dynamic and Extensible"
      ],
      correctAnswer: 1
    },
    {
      question: "Which method must be implemented by all threads in Java?",
      options: [
        "run()",
        "start()",
        "stop()",
        "main()"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the size of float and double in Java?",
      options: [
        "32 and 64",
        "32 and 32",
        "64 and 64",
        "16 and 32"
      ],
      correctAnswer: 0
    },
    {
      question: "Which of the following is a valid declaration of a String?",
      options: [
        "String s1 = null;",
        "String s2 = 'new';",
        "String s3 = 'hello';",
        "Both A and C"
      ],
      correctAnswer: 3
    },
    {
      question: "Which of these classes is abstract?",
      options: [
        "String",
        "System",
        "Math",
        "Scanner"
      ],
      correctAnswer: 2
    },
    {
      question: "Which keyword is used to access the members of a class?",
      options: [
        "dot (.)",
        "->",
        "::",
        "&"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the return type of the hashCode() method in Java?",
      options: [
        "int",
        "float",
        "long",
        "void"
      ],
      correctAnswer: 0
    }
  ],
  nodejs: [
    {
      question: "What is Node.js?",
      options: [
        "A programming language",
        "A framework for databases",
        "A JavaScript runtime built on Chrome's V8 JavaScript engine",
        "A web server"
      ],
      correctAnswer: 2
    },
    {
      question: "Who created Node.js?",
      options: [
        "Ryan Dahl",
        "Brendan Eich",
        "Guido van Rossum",
        "Linus Torvalds"
      ],
      correctAnswer: 0
    },
    {
      question: "Which command is used to initialize a Node.js project?",
      options: [
        "node init",
        "npm init",
        "yarn init",
        "npm start"
      ],
      correctAnswer: 1
    },
    {
      question: "What is npm?",
      options: [
        "Node Package Manager",
        "Node Process Manager",
        "Node Project Manager",
        "None of the above"
      ],
      correctAnswer: 0
    },
    {
      question: "How do you import a module in Node.js?",
      options: [
        "import module",
        "require('module')",
        "include module",
        "using module"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of package.json?",
      options: [
        "To store user data",
        "To manage project dependencies",
        "To compile code",
        "To deploy applications"
      ],
      correctAnswer: 1
    },
    {
      question: "Which method is used to handle asynchronous operations in Node.js?",
      options: [
        "Callbacks",
        "Promises",
        "Async/Await",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      question: "What does the '__dirname' variable represent?",
      options: [
        "Current file name",
        "Directory name of the current module",
        "Current working directory",
        "Parent directory"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you create a server in Node.js?",
      options: [
        "http.createServer()",
        "net.createServer()",
        "Both A and B",
        "ftp.createServer()"
      ],
      correctAnswer: 2
    },
    {
      question: "Which of the following is NOT a Node.js global object?",
      options: [
        "process",
        "buffer",
        "console",
        "window"
      ],
      correctAnswer: 3
    }
  ],
  mongodb: [
    {
      question: "What type of database is MongoDB?",
      options: [
        "Relational database",
        "Network database",
        "Document-oriented NoSQL database",
        "Hierarchical database"
      ],
      correctAnswer: 2
    },
    {
      question: "In MongoDB, what is the equivalent of a table in relational databases?",
      options: [
        "Collection",
        "Schema",
        "Index",
        "View"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the default port for MongoDB?",
      options: [
        "27017",
        "27018",
        "27019",
        "27020"
      ],
      correctAnswer: 0
    },
    {
      question: "Which command is used to insert a document into a collection?",
      options: [
        "insert()",
        "save()",
        "Both A and B",
        "add()"
      ],
      correctAnswer: 2
    },
    {
      question: "What is the _id field in MongoDB documents?",
      options: [
        "A string field",
        "An integer field",
        "A unique identifier (default ObjectId)",
        "A timestamp field"
      ],
      correctAnswer: 2
    },
    {
      question: "Which operator is used for querying documents that match a specific condition?",
      options: [
        "SELECT",
        "WHERE",
        "FIND",
        "QUERY"
      ],
      correctAnswer: 2
    },
    {
      question: "What is an index in MongoDB used for?",
      options: [
        "To store backup data",
        "To improve query performance",
        "To encrypt data",
        "To create relationships"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a valid MongoDB query to find all documents?",
      options: [
        "db.collection.find()",
        "db.collection.getAll()",
        "db.collection.select()",
        "db.collection.read()"
      ],
      correctAnswer: 0
    },
    {
      question: "What is aggregation in MongoDB used for?",
      options: [
        "To sort data only",
        "To process data records and return computed results",
        "To delete data",
        "To create backups"
      ],
      correctAnswer: 1
    },
    {
      question: "How do you specify that a field should be unique in MongoDB?",
      options: [
        "Add 'unique: true' to the field definition",
        "Create a unique index on the field",
        "Use the 'DISTINCT' keyword",
        "Both A and B"
      ],
      correctAnswer: 3
    }
  ]
};

module.exports = skillQuestions;