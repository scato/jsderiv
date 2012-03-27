import Lexer from .lexer;
import ID, LITERAL, SYMBOL, CLASS, KEYWORD from .lexer;

export test "SPACE" {
    start Lexer.SPACE;
    
    assert " " -> ();
}

export test "ID" {
    start Lexer.ID;
    
    assert "id" -> (ID "id");
    assert "start" -> {};
    assert "id2" -> (ID "id2");
    assert "ID_2" -> (ID "ID_2");
}

export test "COMMENT" {
    start Lexer.COMMENT;
    
    assert "/* comment */" -> ();
    assert "// comment" -> ();
}

export test "LITERAL" {
    start Lexer.LITERAL;
    
    assert "\"literal\"" -> (LITERAL "\"literal\"");
}

export test "SYMBOL" {
    start Lexer.SYMBOL;
    
    assert "|" -> (SYMBOL "|");
    assert "<" -> (SYMBOL "<");
    assert ">" -> (SYMBOL ">");
}

export test "CLASS" {
    start Lexer.CLASS;
    
    assert "[0-9]" -> (CLASS "[0-9]");
    assert "[123]" -> (CLASS "[123]");
    assert "[^0-9]" -> (CLASS "[^0-9]");
    assert "[^123]" -> (CLASS "[^123]");
    assert "[0-9^123]" -> (CLASS "[0-9^123]");
    assert "[0-]" -> {};
    assert "[^]" -> {};
}

export test "KEYWORD" {
    start Lexer.KEYWORD;
    
    assert "start" -> (KEYWORD "start");
    assert "extends" -> (KEYWORD "extends");
    assert "super" -> (KEYWORD "super");
}

export test "start" {
    start Lexer.start;
    
    assert "id /* comment */ \"literal\" | [0-9] start" -> (ID "id", LITERAL "\"literal\"", SYMBOL "|", CLASS "[0-9]", KEYWORD "start");
    assert "id /* comment */ \"literal\" | [0-9] start 123" -> {};
}
