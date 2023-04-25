# Unicode编码

## 码点与代码单元

### 码点

码点（code point）：是指与一个编码表中的某个字符对应的代码值。

在Unicode标准中，码点采用十六进制书写，并加上前缀`U+` ，例如 `U+0041` 就是拉丁字母A的码点。

Unicode的码点可以分为17个代码级别（code plane）。第一个代码级别称为基本的多语言级别（basic multilingual plane），码点从U+0000到U+FFFF，其中包括经典的Unicode代码；其余16个级别码点从U+10000到U+10FFFF，其中包括一些辅助字符（supplementary character）。

### 代码单元

UTF-16编码采用不同长度的编码表示所有Unicode码点。

在基本的多语言级别中，每个字符用16位表示，通常被称为代码单元（code unit）；而辅助字符采用**一对**连续的代码单元进行编码，这样构成的编码值落入基本的多语言级别中空闲的2048字节内，通常被称为替代区域（surrogate area）[U+D800~U+DBFF用于第一个代码单元，U+DC00~U+DFFF用于第二个代码单元]

这样设计十分巧妙，我们可以从中迅速地知道一个代码单元是一个字符地编码，还是一个辅助字符的第一或第二部分。

例如：𝕆是八元数集的一个数学符号，码点为U+1D546，编码为两个代码单元U+D835和U+DD46.

```java
public  class App {

    public static void main(String[] args) {
        String greeting = "hello";
        int n = greeting.length();

        System.out.println(n); // 5

        int cpCount = greeting.codePointCount(0, greeting.length());

        System.out.println(cpCount); // 5

        int index = greeting.offsetByCodePoints(0, 3);
        System.out.println(index); // 3
        int cp = greeting.codePointAt(index);
        System.out.println(cp); // 108

        String str = "\uD835\uDD46";
        System.out.println(str); // 𝕆

        char ch = str.charAt(1);
        System.out.println(ch); // ?

        int l = str.codePointCount(0, str.length());
        System.out.println(l);

        for (int i = 0; i < l; i++) {
            int cpi = str.codePointAt(i);
            System.out.println(cpi); // 120134
            // 确定字符是否在辅助字符范围内
            if (Character.isSupplementaryCodePoint(cpi)) {
                i += 2;
            } else {
                i++;
            }
            System.out.println(i); // 1
        }
        
        
        int[] codePoints = str.codePoints().toArray();
        System.out.println(Arrays.toString(codePoints)); // [120134]

        String str2 = new String(codePoints, 0, codePoints.length);
        System.out.println(str2); // 𝕆


    }

}
```

## 字符编码方式

> [ Unicode 字符百科](https://unicode-table.com/cn/)
>
> [编码算法](https://en.wikipedia.org/wiki/UTF-16)