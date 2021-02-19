# Dial for A-Frame WebXR

A shader with a static transparent texture and dynamic pie-wedge shape, suitable for a timer or gauge. Packaged for the [A-Frame](https://aframe.io) framework for [WebXR](https://immersive-web.github.io/).

![sample screenshot](sample.png)

[live example scene](https://dougreeder.github.io/aframe-dial/example.html)


Include using
```html
<script src="https://unpkg.com/aframe-dial@^1.0.0/dist/dial.js"></script>
```


Basic use:
```html
<a-entity dial="src:#dial-face; radius:0.4; thetaStart:135; thetaEnd:315; color:black;"></a-entity>
```

## Properties

### src
The static texture. Must be mostly transparent to let the pie wedge show.

### radius
radius of pie wedge; default **???**

### thetaStart
start angle of pie wedge, in degrees; default **45**

### thetaEnd
end angle of pie wedge, in degrees; default **270**

### color
color of pie wedge, default **white**


## License

This program is free software and is distributed under the [MIT License](LICENSE).
