# Spring-Boot-Test

## 需要注入依赖的使用方法

### 2.2版本之前

2.2版本之前，类上需要标注`@SpringBootTest`、`@RunWith(SpringRunner.class)`注解，在测试方法上需要使用`junit`的`@Test`注解。

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


@SpringBootTest
@RunWith(SpringRunner.class)
public class ApplicationTest {

    @Autowired
    private Mapper mapper;
    
	@Test
    public void test() {
        List<String> ids = new ArrayList<String>() {{
            add("0A92B6048E804BF2B63508A3D01FF728");
            add("5C5B28758B034E159FD808E48FB8A73E");
            add("8DD87F66671E4C7E8045EB52A2F88D46");
            add("36BFA2464AA1418984A373ACC8ABD744");
        }};
       
        List list = mapper.selectByIdList(ids);
        System.out.println(list.size());
    }
}

```

### 2.2版本之后

2.2版本之后，类上只需要使用`@SpringBootTest`主键，在测试方法上使用`jupiter`的`@Test`注解即可

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ApplicationTest {

    @Autowired
    private Mapper mapper;
    
	@Test
    public void test() {
        List<String> ids = new ArrayList<String>() {{
            add("0A92B6048E804BF2B63508A3D01FF728");
            add("5C5B28758B034E159FD808E48FB8A73E");
            add("8DD87F66671E4C7E8045EB52A2F88D46");
            add("36BFA2464AA1418984A373ACC8ABD744");
        }};
       
        List list = mapper.selectByIdList(ids);
        System.out.println(list.size());
    }
}
```

