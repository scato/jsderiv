import Parser from .parser;
import ID, LITERAL from .lexer;

export constructor Test, StartDeclaration, Assertion, NodeList, NodeSet;

augment grammar Parser {
    Definition: default | Test;
    
    Test: "test"! @LITERAL "{"! StartDeclaration Assertion* "}"! -> Test;
    
    StartDeclaration: "start"! RuleIdentifier ";"! -> StartDeclaration;
    RuleIdentifier: @ID "."! @ID | @ID "."! "start"!;
    
    Assertion: "assert"! NodeList "->"! NodeSet ";"! -> Assertion;
    
    NodeList: "(" (Node (","! Node)*)? ")" -> NodeList | @LITERAL;
    NodeSet: "{" (NodeList (","! NodeList)*)? "}" -> NodeSet | NodeList -> NodeSet;
    Node: @ID NodeList;
}
