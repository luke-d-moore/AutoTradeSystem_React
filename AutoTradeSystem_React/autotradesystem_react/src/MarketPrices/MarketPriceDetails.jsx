import { useParams } from 'react-router';

function DetailView() {
    const { ticker } = useParams(); 

    return (
        <section>
            <div>
                <h3>Details for {ticker}</h3>
            </div>
        </section>
    );
}

export default DetailView;

