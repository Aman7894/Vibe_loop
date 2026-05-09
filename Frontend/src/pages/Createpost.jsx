import react from 'react';

const Createpost=()=>{
    return(
        <section className='create-post-section'>
            <h1>Create post</h1>
            <form>
                <input type="file" name="image" accept='image/*'/>
                <input type="text" name="caption" placeholder='Caption'  required/>
                <button type='submit'>Post</button>
            </form>
        </section>
    )
}