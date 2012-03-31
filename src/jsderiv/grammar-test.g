import Lexer, KEYWORD from .lexer;

augment grammar Lexer {
    KEYWORD: default | ("test" | "assert") -> KEYWORD;
}

import Parser, Literal from .parser;
import ID, LITERAL from .lexer;

export constructor Test, StartDeclaration, Assertion, NodeList, NodeSet, Node, Terminal;

augment grammar Parser {
    Definition: default | Test;
    
    Test: "test"! @LITERAL "{"! StartDeclaration (Assertion* -> List) "}"! -> Test;
    
    StartDeclaration: "start"! RuleIdentifier ";"! -> StartDeclaration;
    RuleIdentifier: @ID "."! @ID | @ID "."! ("start" -> Text);
    
    Assertion: "assert"! NodeList "->"! NodeSet ";"! -> Assertion;
    
    NodeList: "("! (Node (","! Node)*)? ")"! -> NodeList | @LITERAL -> Terminal;
    NodeSet: "{"! (NodeList (","! NodeList)*)? "}"! -> NodeSet | NodeList -> NodeSet;
    Node: @ID NodeList -> Node | NodeList;
    
    // Node: NodeList provides shorthands
    //       (a, b, c) for List(a, b, c)
    //       and "abc" for Text "abc"
}
