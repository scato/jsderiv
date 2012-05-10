import Scannerless from ...src."grammar"."grammar-classes";
import Class, Char, Control, Unicode, Range, Category, Not from ...src."grammar"."grammar-classes";

export test "CONTROL" {
    start Scannerless.CONTROL;
    
    assert "\\t" -> ("\\t");
    assert "\\r" -> ("\\r");
    assert "\\n" -> ("\\n");
    assert "\\v" -> ("\\v");
    assert "\\f" -> ("\\f");
    
    assert "\\w" -> {};
}

export test "UNICODE" {
    start Scannerless.UNICODE;
    
    assert "\\u0020" -> ("\\u0020");
    assert "\\u20" -> {};
}

export test "CHAR" {
    start Scannerless.CHAR;
    
    assert "\\^" -> ("\\^");
    assert "\\-" -> ("\\-");
    assert "\\\\" -> ("\\\\");
    assert "\\]" -> ("\\]");
    assert "a" -> ("a");
    
    assert "\\" -> {};
    assert "^" -> {};
}

export test "CATEGORY" {
    start Scannerless.CATEGORY;
    
    assert "\\d" -> ("\\d");
    assert "\\D" -> ("\\D");
    assert "\\s" -> ("\\s");
    assert "\\S" -> ("\\S");
    assert "\\w" -> ("\\w");
    assert "\\W" -> ("\\W");
    assert "\\p{L}" -> ("\\p{L}");
    assert "\\P{L}" -> ("\\P{L}");
    
    assert "\\t" -> {};
    assert "\\p" -> {};
}

export test "Range" {
    start Scannerless.Range;
    
    assert "a-z" -> (Range("a", "z"));
    assert "\\u0020-\\u007e" -> (Range("\\u0020", "\\u007e"));
    
    assert "a" -> {};
    assert "a-" -> {};
}

export test "Category" {
    start Scannerless.Category;
    
    assert "\\w" -> (Category("\\w"));
}

export test "Char" {
    start Scannerless.Char;
    
    assert "\\w" -> (Category("\\w"));
    assert "a" -> (Char("a"));
    assert "\\-" -> (Char("\\-"));
    assert "\\t" -> (Control("\\t"));
    assert "\\u0020" -> (Unicode("\\u0020"));
    
    assert "-" -> {};
}

export test "Class" {
    start Scannerless.Class;
    
    assert "[\\t\\u0020\\-\\w0-9]" -> (Class(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9")));
    assert "[^\\t\\u0020\\-\\w0-9]" -> (Class(Not(Control("\\t"), Unicode("\\u0020"), Char("\\-"), Category("\\w"), Range("0", "9"))));
    
    assert "[a-z^cqxy]" -> {};
}

