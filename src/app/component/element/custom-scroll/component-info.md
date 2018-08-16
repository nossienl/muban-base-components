# Custom Scroll

Custom scroll-bar based on Gsap draggable

## Dependencies

##### gsap

###### yarn / npm
`yarn add gsap`

`npm i gsap`

## Usage

Copy over `custom-scroll` folder to `component/element`

too use the custom scrollbar wrap your element in these tags

```
 {{#> element/custom-scroll }}
    your component / data /text
 {{/element/custom-scroll}}
 
 Options : 
   inside: boolean;
   set-content-size: boolean; // if set to false inside does not work
     
  Usage : 
  
  {{#> element/custom-scroll inside=true set-content-size=true }}
   {{/element/custom-scroll}}
```

## Done

Change styling to own project/likings.
