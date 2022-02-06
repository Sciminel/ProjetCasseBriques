const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const afficheScrore = document.querySelector('.score');


canvas.width = '750';
canvas.height = '450';

//Définir les valeurs de la balle et de la barre
const rayonBalle = 10, barreHeight = 10, barreWidth = 75;
const nbCol = 8, nbRow = 5, largeurBrique = 75, hauteurBrique = 20;
//Définir la position de la balle au lancement
let x = canvas.width/2;
let y = canvas.height - 30;
let barreX = (canvas.width - barreWidth) / 2;
let barreY = (canvas.height - barreHeight) - 5;
let fin = false, vitesseX = 5, vitesseY = 5, score = 0;

function dessinBalle(){

    ctx.beginPath();
    ctx.arc(x, y, rayonBalle, 0, 2*Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

function dessinBarre(){

    ctx.beginPath();
    ctx.rect(barreX, barreY, barreWidth, barreHeight);
    ctx.fillStyle = "#333"
    ctx.fill();
    ctx.closePath();
}

// Tableau de toutes les briques
const briques = [];

for(let i = 0; i < nbRow; i++){

    // Pour chaque ranger on fait un tableau
    briques[i] = [];

    for(let j = 0; j < nbCol; j++){

        briques[i][j] = {
            x:0,
            y:0,
            status:1
        }

    }

}

function dessineBriques(){

    for(let i = 0; i < nbRow; i++){
        for(let j = 0; j < nbCol; j++){

            if(briques[i][j].status === 1){
                // 75 * 8 + 10 * 8 + 35 = 750 (Width du canvas)
                let briqueX = (j * (largeurBrique + 10) + 35);
                let briqueY = (i * (hauteurBrique + 10) + 30);

                briques[i][j].x = briqueX;
                briques[i][j].y = briqueY;

                ctx.beginPath();
                ctx.rect(briqueX,briqueY,largeurBrique,hauteurBrique);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();

            }
        }

    }
}




function dessine(){

    if(fin === false){

        ctx.clearRect(0,0,canvas.width, canvas.height);
        dessineBriques();
        dessinBalle();
        dessinBarre();
        collisionDetection()


        if(x + vitesseX > canvas.width - rayonBalle || x + vitesseX < rayonBalle){
            vitesseX = -vitesseX;
        }
        if(y + vitesseY < rayonBalle){
            vitesseY = -vitesseY;
        }


        if(y + vitesseY > canvas.height - 15){

            if(x - rayonBalle> barreX && x < barreWidth + barreX + 8){
                vitesseY = vitesseY + 0.2;
                vitesseX = vitesseX + 0.2;
                vitesseY = -vitesseY;
                
            }else {
                fin = true;
                afficheScrore.innerHTML = `perdu ! <br> Clique sur le casse brique pour rejouer`;
            }
        }

        x += vitesseX;
        y += vitesseY;
        requestAnimationFrame(dessine);

    }
}

dessine();

//Detection de collision 

function collisionDetection(){
    
    for(let i = 0; i < nbRow; i++){
        for(let j = 0; j < nbCol; j++){

            let b = briques[i][j];
            if(b.status === 1){
                if( x > b.x && x < b.x + largeurBrique && y < b.y + hauteurBrique && y > b.y ){

                    vitesseY = -vitesseY;
                    b.status = 0;
                    score++;
                    afficheScrore.innerHTML = `Score : ${score}`

                    if(b.status === 0){
                        delete b;
                    }
                    if(score === nbRow * nbCol){
                        afficheScrore.innerHTML = `Bien joué ! <br> Clique sur le casse brique si tu veux recommencer`
                        fin = true;
                    }
                }

            }

        }

    }
}



//mouvement de la barre avec la souris 

document.addEventListener('mousemove', mouvementSouris);

function mouvementSouris(e){

    let posXBarreCanvas = e.clientX - canvas.offsetLeft;
    // e.client = de la gauche jusqu'a la souris 
    // canvas.offsetLeft = décalage par rapport a la gauche du canvas 

    if(posXBarreCanvas > 35 && posXBarreCanvas < canvas.width - 35){
        barreX = posXBarreCanvas - barreWidth / 2;

    }
}

// Recommencer la partie
canvas.addEventListener('click', () => {

    if (fin === true){
        fin = false;
        document.location.reload();
    }
})