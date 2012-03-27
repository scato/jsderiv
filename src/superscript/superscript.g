import {Lexical, Syntactic} from ..ecmascript5.ecmascript5;
import {LogicalORExpression} from ..ecmascript5.ecmascript5;

augment grammar Lexical {
    Punctuator: default | "?:";
}

augment grammar Syntactic {
    LogicalORExpression: default | LogicalORExpression <LineTerminator>*! ("?:" -> Text) <LineTerminator>*! LogicalANDExpression -> LogicalORExpression;
}
