const c1 = document.getElementById("pinhole");
const c1_ctx = c1.getContext("2d");

const c2 = document.getElementById("perspective");
const c2_ctx = c2.getContext("2d");

var cube_matrix = 
[
    [1, 1, 1],
    [-1, 1, 1],
    [1, -1, 1],
    [-1, -1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    [1, -1, -1],
    [-1, -1, -1],
];

// uses index of cube matrix as endpoints
var edge_list =
[
    [0, 1], [2, 3], [4, 5], [6, 7],
    [0, 2], [1, 3], [4, 6], [5, 7],
    [0, 4], [2, 6], [1, 5], [3, 7]
]

var camera_pos = [5, 5, 5]

function worldToCameraSpace(camera, object)
{
    camera_transformed = [];

    for (let i = 0; i < object.length; i++)
    {
        let coord = [];
        for (let j = 0; j < object[i].length; j++)
        {
            coord.push(camera[j] - object[i][j]);
        }
        camera_transformed.push(coord);
    }

    return camera_transformed;
}

function CameraSpaceToUVSpace(cameraTransformedCoordinates)
{
    var uv_coordinates = [];

    for (let i = 0; i < cameraTransformedCoordinates.length; i++)
    {
        var u = cameraTransformedCoordinates[i][0] / cameraTransformedCoordinates[i][2];
        var v = cameraTransformedCoordinates[i][1] / cameraTransformedCoordinates[i][2];

        uv_coordinates.push([u, v]);
    }

    return uv_coordinates;
}

function rotateY(matrix, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return matrix.map(([x, y, z]) => {
        const newX = x * cos - z * sin;
        const newZ = x * sin + z * cos;
        return [newX, y, newZ];
    });
}

function ScaleUV(uv, scale)
{
    scaled_uvs = []
    for (let i = 0; i < uv.length; i++)
    {
        scaled_uvs.push([uv[i][0] * scale, uv[i][1] * scale]);
    }

    return scaled_uvs;
}

function renderScene()
{
    for (let i = 0;  i < uv_coords.length; i++)
    {
        c1_ctx.fillRect(scaled_uv_coords[i][0],scaled_uv_coords[i][1],3,3);
    }

    for (let i = 0; i < edge_list.length; i++)
    {
        c1_ctx.beginPath();
        c1_ctx.moveTo(...scaled_uv_coords[edge_list[i][0]]); // start vertex
        c1_ctx.lineTo(...scaled_uv_coords[edge_list[i][1]]); // end vertex
        c1_ctx.stroke();
    }
}

let angle = 0;
let frame = 0;
function animate() {
    c1_ctx.clearRect(0, 0, c1.width, c1.height);

    angle += 0.01;
    frame++;
    let matrix = rotateY(cube_matrix, angle);

    cam_space_coords = worldToCameraSpace(camera_pos, matrix);
    uv_coords = CameraSpaceToUVSpace(cam_space_coords);
    scaled_uv_coords = ScaleUV(uv_coords, 200);

    renderScene();
    requestAnimationFrame(animate);
}

animate();
