export constructor Class, Char, Control, Unicode, Range, Category, Not;

export grammar Scannerless {
    start Class;
    
    CONTROL:  <"\\t" | "\\r" | "\\n" | "\\v" | "\\f">;
    UNICODE:  <"\\u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]>;
    CHAR:     <[^\^\-\\\]] | "\\^" | "\\-" | "\\\\" | "\\]">;
    CATEGORY: <"\\d" | "\\D" | "\\s" | "\\S" | "\\w" | "\\W" | "\\p{" [A-Za-z_]* "}" | "\\P{" [A-Za-z_]+ "}">;
    
    Range:    (CHAR | UNICODE) "-"! (CHAR | UNICODE) -> Range;
    Category: CATEGORY -> Category;
    Char:     Category | CHAR -> Char | CONTROL -> Control | UNICODE -> Unicode;
    Class:    "["! ((Range | Char)+ | "^"! (Range | Char)+ -> Not) "]"! -> Class;
}

