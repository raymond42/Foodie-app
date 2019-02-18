if (req.file) {
        const fieldFound = await Sauce.findById({
            _id: req.params.id
        });
        if (fieldFound) {
            let filename = fieldFound.imageUrl.split("/images/")[1];
            fs.unlink('images/' + filename, async () => {
                let data = JSON.parse(req.body.sauce);
                const name = data.name;
                const manufacturer = data.manufacturer;
                const description = data.description;
                const mainPepper = data.mainPepper;
                const heat = data.heat;
                const url = "http://" + req.get('host') + "/images/" + req.file.filename;

                const sauce = await Sauce.findByIdAndUpdate(
                    req.params.id, {
                        name: name,
                        manufacturer: manufacturer,
                        description: description,
                        mainPepper: mainPepper,
                        heat: heat,
                        userId: req.user.id,
                        imageUrl: url
                    }, {
                        new: true
                    })

                if (!sauce) return res.status(400).send({
                    message: "sauce with given id isn't updated...."
                });

                await sauce.save();
            });
        }


        res.status(200).send({
            message: "updated..."
        })
    } else {
        const name = req.body.name;
        const manufacturer = req.body.manufacturer;
        const description = req.body.description;
        const mainPepper = req.body.mainPepper;
        const heat = req.body.heat;
        const sauce = await Sauce.findByIdAndUpdate(
            req.params.id, {
                name: name,
                manufacturer: manufacturer,
                description: description,
                mainPepper: mainPepper,
                heat: heat
            }, {
                new: true
            });

        if (!sauce) return res.status(404).send({
            message: "sauce with given id is not found...."
        });

        await sauce.save();
        res.status(200).send({
            message: "updated..."
        })
    }