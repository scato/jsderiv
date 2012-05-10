import Lexer, KEYWORD, LITERAL, SYMBOL, ID, QID from ...src."grammar"."grammar";

export test "KEYWORD" {
    start Lexer.KEYWORD;
    
    assert "test" -> (KEYWORD("test"));
    assert "assert" -> (KEYWORD("assert"));
}

export test "Lexer" {
    start Lexer.start;
    
    assert "test" -> (KEYWORD("test"));
    assert "tester" -> (ID("tester"));
}

import Parser, Export from ...src."grammar"."grammar";
import Test, StartDeclaration, Assertion from ...src."grammar"."grammar-test";
import List, Set, Node, Term from ...src."grammar"."grammar-test";

/*
export test "Example" {
    start Example.NEWLINE;
    
    assert "\n" -> (NEWLINE("\n"));
}
*/

export test "Definition" {
    start Parser.Definition;
    
    assert (
        KEYWORD("test"), LITERAL("\"Example\""), SYMBOL("{"),
            KEYWORD("start"), QID("Example.NEWLINE"), SYMBOL(";"),
            KEYWORD("assert"), LITERAL("\"\\n\""), SYMBOL("->"), SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")"), SYMBOL(";"),
        SYMBOL("}")
    ) -> (
        Test("\"Example\"",
            StartDeclaration("Example.NEWLINE"),
            (
                Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\""))))))
            )
        )
    );
}

export test "StartDeclaration" {
    start Parser.StartDeclaration;
    
    assert (KEYWORD("start"), QID("Example.Definition"), SYMBOL(";")) -> (StartDeclaration("Example.Definition"));
}

export test "Assertion" {
    start Parser.Assertion;
    
    assert (KEYWORD("assert"), LITERAL("\"\\n\""), SYMBOL("->"), SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")"), SYMBOL(";")) -> (Assertion(Term("\"\\n\""), Set(List(Node("NEWLINE", List(Term("\"\\n\"")))))));
}

export test "NodeList" {
    start Parser.NodeList;
    
    assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")) -> (List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\"")))));
    assert (LITERAL("\"\\r\\n\"")) -> (Term("\"\\r\\n\""));
}

export test "NodeSet" {
    start Parser.NodeSet;
    
    assert (SYMBOL("{"), SYMBOL("}")) -> (Set());
    assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")) -> (Set(List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\""))))));
    assert (LITERAL("\"\\r\\n\"")) -> (Set(Term("\"\\r\\n\"")));
}

export test "List" {
    start Parser.List;
    
    assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(","), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")"), SYMBOL(")")) -> (List(Node("NEWLINE", List(Term("\"\\n\""))), Node("NEWLINE", List(Term("\"\\r\\n\"")))));
}

export test "Term" {
    start Parser.Term;
    
    assert (LITERAL("\"\\r\\n\"")) -> (Term("\"\\r\\n\""));
}

export test "Node" {
    start Parser.Node;
    
    assert (ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\r\\n\""), SYMBOL(")")) -> (Node("NEWLINE", List(Term("\"\\r\\n\""))));
    assert (LITERAL("\"\\n\"")) -> (Term("\"\\n\""));
    assert (SYMBOL("("), ID("NEWLINE"), SYMBOL("("), LITERAL("\"\\n\""), SYMBOL(")"), SYMBOL(")")) -> (List(Node("NEWLINE", List(Term("\"\\n\"")))));
    
    assert (ID("NEWLINE"), LITERAL("\"\\r\\n\"")) -> {};
    assert (SYMBOL("("), ID("NEWLINE"), LITERAL("\"\\n\""), SYMBOL(")")) -> {};
}

