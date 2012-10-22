var
bitDiameter = 6.38,//3.45,
bitRadius = bitDiameter/2,
innerHoleWidth = 22,
outerHoleWidth = 291.2,//38,
outerDepth = 3.5,
innerDepth = outerDepth+12.175,
passWidth = bitDiameter/4,
feedRate = 1000,
seekRate = 1100,
negate = 1,
yOffset = 6.85800*negate,
xOffset = 6.85800*negate,
cutZ = 105,//,87,//92,//89.5,
safeZ = 85,//-90,//84*negate,
gcode = [
  'G90',
  'G82',
  'M4',
  'G1 Z' + safeZ + ' F800'
];

function move(coords) {
  var parts = [
    'G1',
  ];

  for (var coord in coords) {
    if (coords.hasOwnProperty(coord)) {
      parts.push(coord.toUpperCase() + coords[coord]);
    }
  }

  gcode.push(parts.join(' '));
}

function fillSquareSpiral(offsetX, offsetY, width, depth, depthPasses, depthOffset) {
  // find centers
  var halfWidth = (width)/2;
  var localCenterX = halfWidth;
  var localCenterY = halfWidth;
  var centerX = localCenterX*negate + offsetX;
  var centerY = localCenterY*negate + offsetY;
  var xyPasses = (halfWidth-bitRadius)/passWidth;
  var offset = 0;


  // start cutting at the offset
  depth = depth - depthOffset;
  var depthPerPass = depth/depthPasses;

  for (var currentDepthPass = 1; currentDepthPass <= depthPasses; currentDepthPass++) {

    // head to the center at a safeZ
    if (currentDepthPass === 1) {
      move({ z : safeZ, f: 800 });
    }

    move({
      x : centerX,
      y : centerY,
      f : seekRate
    });

    move({
      z : ((cutZ + depthOffset) + (currentDepthPass*depthPerPass))*negate,
      f: 800
    });
    var offset;
    // Skip 0 since it it won't be doing much anyhow.
    for (var pass = 1; ; pass++) {
      if (pass > xyPasses) {
        var remainder = xyPasses%1;
        offset = xyPasses * passWidth;
      } else {
        offset = pass*passWidth;
      }
      /*
        cut in the appropriate direction (CW)

        *>*
        ^ |
        | |
        | v
        *<*
      */

      // move into the material (bottom left)
      move({
        x : centerX - offset,
        y : centerY - offset,
        f : feedRate
      });

      // go right
      move({
        x : centerX + offset,
        f : feedRate
      });

      // go up
      move({
        y : centerY + offset,
        f : feedRate
      });

      // go left
      move({
        x : centerX - offset,
        f : feedRate
      });

      // go down
      move({
        y : centerY - offset,
        f : feedRate
      });

      if (pass > xyPasses) {
        break;
      }
    }
  }
}

// plane the ridge so its uniform
//fillSquareSpiral(0, 0, outerHoleWidth + (xOffset*2)*negate, outerDepth-3, 1, 0);

// create the ridge by insetting a square
//fillSquareSpiral(xOffset, yOffset, outerHoleWidth, outerDepth, 2, 0);

for (var j=4; j<=9; j++) {
  for (var k=1; k<=9; k++) {

    // 6.8 is magic for the offset
    var
    xHoleOffset = xOffset + ((j*8) + ((j-1)*innerHoleWidth) + 6.8) * negate,
    yHoleOffset = yOffset + ((k*8) + ((k-1)*innerHoleWidth) + 6.8) * negate;

    //fillSquareSpiral(xHoleOffset+8, yHoleOffset+8, outerHoleWidth, outerDepth, 3, 0);

    fillSquareSpiral(
      xHoleOffset,
      yHoleOffset,
      innerHoleWidth,
      innerDepth,
      10,
      outerDepth
    );

    // raise the z
    move({ z: safeZ });
  }
}

// just wait there for a second
gcode.push('G4 P1');

// turn off the spindle
gcode.push('M5');

// go home
gcode.push('G1 Z0 F300');
gcode.push('G1 X0 Y0 F800');
console.log(gcode.join('\n'));
