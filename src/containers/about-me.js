import Text from '@/components/text'

// Styles
import styles from './about-me.module.scss'

function AboutMe() {
	return (
		<Text>
			This is index page and this text is global css usage example
				
			<br/>
			<div className={styles.aboutMe}>This text is CSS Module example</div>
		</Text>
	)
}

export default AboutMe;
