# Dial for A-Frame WebXR

A component with a transparent bezel texture and dynamic pie-wedge shape, suitable for a timer or gauge. Packaged for the [A-Frame](https://aframe.io) framework for [WebXR](https://immersive-web.github.io/).

![sample screenshot](sample.png)

[live example scene](https://dougreeder.github.io/aframe-dial/example.html)


Include using
```html
<script src="https://unpkg.com/aframe-dial@^1.0.0/dist/dial.js"></script>
```


Basic use:
```html
<a-assets>
    <img id="bezel" src="./assets/bezel.png">
</a-assets>
<a-entity dial="src:#bezel; radius:0.95; thetaStart:135; thetaEnd:315; color:black;"></a-entity>
```

## Properties

### src
The static bezel texture.
Should be opaque at *radius* distance from center, to hide the edge of the wedge.
Should be mostly transparent in the center, to let the pie wedge show.

### radius
radius of pie wedge, relative to size of dial.  default **0.98**

### thetaStart
start angle of pie wedge, in degrees; default **0**

### thetaEnd
end angle of pie wedge, in degrees; default **230**

### wedgeColor
color of pie wedge, default **white**


## License

This program is free software and is distributed under the [MIT License](LICENSE).
