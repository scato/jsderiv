import Lexer, Parser, ID, QID, LITERAL, KEYWORD from ...src."grammar"."grammar";

augment grammar Lexer {
    // TODO: fix caching
    start (SPACE | ID | QID | COMMENT | LITERAL | CHAR | CATEGORY | SYMBOL | CLASS | KEYWORD)*;
    ID: default & ~KEYWORD;
    
    KEYWORD: default | <"test" | "assert"> ?= ~[A-Za-z0-9_\-] -> KEYWORD;
}

export constructor Test, StartDeclaration, Assertion;
export constructor List, Set, Node, Term;

augment grammar Parser {
    Definition: default | Test;
    
    Test: "test"! @LITERAL "{"! StartDeclaration <Assertion*> "}"! -> Test;
    
    StartDeclaration: "start"! (@ID | @QID) ";"! -> StartDeclaration;
    
    Assertion: "assert"! NodeList "->"! NodeSet ";"! -> Assertion;
    
    NodeList: List | Term;
    List: "("! (Node (","! Node)*)? ")"! -> List;
    Term: @LITERAL -> Term;
    NodeSet: "{"! (NodeList (","! NodeList)*)? "}"! -> Set | NodeList -> Set;
    Node: @ID List -> Node | NodeList;
    
    // Node: NodeList provides shorthands
    //       (a, b, c) for List(a, b, c)
    //       and "abc" for Text "abc"
}
