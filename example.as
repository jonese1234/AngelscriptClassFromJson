class Example {
    string Example1;
    int Example2;
    Example3@ Example3;

    Example(string example1, int example2, Example3@ example3){
        Example1 = example1;
        Example2 = example2;
        @Example3 = example3;
    }

    Example(Json::Value data){
        Example1 = data["example1"];
        Example2 = data["example2"];
        @Example3 = Example3(data["example3"]);
    }

    Json::Value Serialize(){
        Json::Value obj = Json::Object();
        obj["example1"] = Example1;
        obj["example2"] = Example2;
        obj["example3"] = Example3.Serialize();
        return obj;
    }
}

class Example3{
    string Example4;
    int Example5;

    Example3(string example4, int example5){
        Example4 = example4;
        Example5 = example5;
    }

    Example3(Json::Value data){
        Example4 = data["example4"];
        Example5 = data["example5"];
    }

    Json::Value Serialize(){
        Json::Value obj = Json::Object();
        obj["example4"] = Example4;
        obj["example5"] = Example5;
        return obj;
    }
}
