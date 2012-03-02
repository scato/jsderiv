export grammar Lexical {
    WhiteSpace: "\t" | "\v" | "\f" | " " | "\u00a0" | "\ufeff" | [\s^\t\n\r\v\f \u00a0\u2028\u2029];
    UnicodeLetter: [\p{Lu}\p{Ll}\p{Lt}\p{Lm}\p{Lo}\p{Nl}];
    UnicodeCombiningMark: [\p{Mn}\p{Mc}];
    UnicodeDigit: [\p{Nd}];
    UnicodeConnectorPunctuation: [\p{Pc}];
}

export grammar Syntactic {
}

export grammar String {
}
