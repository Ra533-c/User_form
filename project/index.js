import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import fs from "fs";
import methodOverride from "method-override";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    fs.readdir(`./files`, function (err, files) {
        console.log(files);
        res.render("index", { files: files });
    });
});
app.post("/create", (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`, req.body.details, function (err) {
        if (err) throw err;
        res.redirect("/");
    });
});


app.get("/edit/:filename", (req, res) => {
    const { filename } = req.params;
    fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
        if (err) return res.status(500).send(" Error reading file!");
        res.render("edit", {
            title: filename.replace('.txt', ''),
            details: data,
        });
    })
});

app.put("/edit/:filename", (req, res) => {
    const { filename } = req.params;
    fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`, req.body.details, (err) => {
        console.log(req.body);
        if (err) {
            console.log(err);
            return res.status(500).send("Error updating file!");
        }
        if (filename !== `${req.body.title.split(" ").join("")}.txt`) {
            fs.unlink(`./files/${filename}`, (err) => {
                if (err) return res.status(500).send("Error renaming file!");
                res.redirect("/");
            });
        } else {
            res.redirect("/");
        }
    });
})

app.get("/read/:filename", (req, res) => {
    const { filename } = req.params;
    fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
        if (err) return res.status(500).send("Error reading file!");
        res.render("read", {
            title: filename.replace('.txt', ''),
            details: data
        });
    });
});

app.post("/delete/:filename", (req, res) => {
    const { filename } = req.params;
    fs.unlink(`./files/${filename}`, (err) => {
        if (err) return res.status(500).send("Error deleting files!");
        res.redirect("/");
    });
});

app.listen(3000, () => console.log("Server is running on port 3000"));