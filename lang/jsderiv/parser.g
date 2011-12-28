import {ID, CLASS, LITERAL} from .lexer;

grammar parser {
    Grammar         : "grammar"! ID ";"! Statement* -> Grammar ;
    Statement       : StartDeclaration | Import | Rule ;
    StartDeclaration: "start"! Expression ";"! ;
    Import          : "import"! IdentifierList "from"! ModuleIdentifier ";"! ;
    IdentifierList  : "{"! ID (","! ID)* "}"! -> Array ;
    ModuleIdentifier: "."* ID ("." ID)* -> String ;
    Rule            : ID ":"! Expression ";"! ;
    
    Expression  : OrExpr ;
    
    OrExpr      : OrExpr "|" RedExpr -> Or
                | RedExpr ;
    RedExpr     : AndExpr "->" ID -> Red
                | AndExpr ;
    AndExpr     : AndExpr "&" SeqExpr -> And
                | SeqExpr ;
    SeqExpr     : SeqExpr RightExpr -> Seq
                | RightExpr ;
    RightExpr   : LeftExpr "*" -> Any
                | LeftExpr "+" -> Many
                | LeftExpr "?" -> Maybe
                | LeftExpr "!" -> Ignore
                | LeftExpr ;
    LeftExpr    : "~" Terminal -> Not
                | "@" ID -> Token
                | Terminal ;
    
    Terminal    : "(" Expression ")"
                | @ID -> Ref
                | @CLASS -> Class
                | @LITERAL -> Literal ;
}
