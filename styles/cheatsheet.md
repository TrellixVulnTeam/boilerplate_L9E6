## Organization

### Tools

- css gradient
- ## illustrator

### Thoughts

- Is there a way to create mixins, thereby making development faster and more efficient?
- E.g., organizing fonts -
- E.g., organizing grids
-

### Initial

- Copy everything from pug file

### Planning

- Think about what is shared (put in shared styles)
-

## Breakpoints

below phone...

```
@include("<phone") {
    flex-direction: column;
    margin: auto;
    width: 66.1rem;
}
and in fonts 
@include("<phone") {
    font-size: 3rem; 
}
```


## Commands

```
%variableToBeExtended {

}
```

## Managing Breakpoints

```
@include media("<tablet") {
    height: 3rem;
    width: 29rem;
}
```
