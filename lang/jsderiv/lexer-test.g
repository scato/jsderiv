import Grammar from ..src.jsderiv.lexer;
import ID, LITERAL, SYMBOL, CLASS, KEYWORD from ..src.jsderiv.lexer;

export test "SPACE" {
    start Grammar.SPACE;
    
    assert " " -> ();
}

export test "ID" {
    start Grammar.ID;
    
    assert "id" -> (ID("id"));
    assert "start" -> {};
}

export test "COMMENT" {
    start Grammar.COMMENT;
    
    assert "/* comment */" -> ();
    assert "// comment" -> ();
}

export test "LITERAL" {
    start Grammar.LITERAL;
    
    assert "\"literal\"" -> (LITERAL("\"literal\""));
}

export test "SYMBOL" {
    start Grammar.SYMBOL;
    
    assert "|" -> (SYMBOL("|"));
}

export test "CLASS" {
    start Grammar.CLASS;
    
    assert "[0-9]" -> (CLASS("[0-9]"));
    assert "[123]" -> (CLASS("[123]"));
    assert "[^0-9]" -> (CLASS("[^0-9]"));
    assert "[^123]" -> (CLASS("[^123]"));
    assert "[0-9^123]" -> (CLASS("[0-9^123]"));
    assert "[0-]" -> {};
    assert "[^]" -> {};
}

export test "KEYWORD" {
    start Grammar.KEYWORD;
    
    assert "start" -> (KEYWORD("start"));
}

export test "start" {
    assert "id /* comment */ \"literal\" | [0-9] start" -> (ID("id"), LITERAL("\"literal\""), SYMBOL("|"), RANGE("[0-9]"), KEYWORD("start"));
    assert "id /* comment */ \"literal\" | [0-9] start 123" -> {};
}
