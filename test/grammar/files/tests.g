import Scannerless from .example;
import Var, Lit from .example;

export test "Scannerless.Var" {
    start Scannerless.Var;
    
    assert "var id;" -> (Var("id"));
    assert "var id = 'x';" -> (Var("id", Lit("x")));
}

