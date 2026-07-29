function Statistics() {

    const stats = [

        {
            number: "1200+",
            title: "Students"
        },

        {
            number: "12",
            title: "Courses"
        },

        {
            number: "25+",
            title: "Lessons"
        },

        {
            number: "95%",
            title: "Success Rate"
        }

    ];

    return (

        <section className="py-5">

            <div className="container">

                <div className="row g-4">

                    {stats.map((item, index) => (

                        <div className="col-md-3" key={index}>

                            <div className="stats-panel rounded-4 text-center p-4 h-100">

                                <h2 className="display-5 fw-bold text-primary">

                                    {item.number}

                                </h2>

                                <p className="mb-0 text-muted">

                                    {item.title}

                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default Statistics;