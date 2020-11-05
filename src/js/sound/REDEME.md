# 音效系统

## 攻击命中音效

``` mermaid
graph TD;
    A[生成vita.hitenemys事件]-->B;
    B[检测命中e.from<Hurt>的proto.hitsound]-->C
    C[检测命中vita.proto.hitsound]-->D[使用默认hitsound]
```

## 攻击|技能音效

>攻击音效由attackProto提供

>技能音效写在技能实时代码里