<?php
/*------------------------------------------------------------------------
# JSN PowerAdmin
# ------------------------------------------------------------------------
# author    JoomlaShine.com Team
# copyright Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
# Websites: http://www.joomlashine.com
# Technical Support:  Feedback - http://www.joomlashine.com/joomlashine/contact-us.html
# @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
# @version $Id: jsnhelp.php 12506 2012-05-09 03:55:24Z hiennh $
-------------------------------------------------------------------------*/

defined('JPATH_PLATFORM') or die;


/**
 * Renders a JSNLink button
 *
 * @package     Joomla.Platform
 * @subpackage  HTML
 * @since       11.1
 */
class JToolbarButtonJSNLink extends JToolbarButton
{
	/**
	 * Button type
	 *
	 * @var    string
	 */
	protected $_name = 'JSNLink';

	public function render(&$definition)
	{
		// Get arguments.
		list($type, $options) = $definition;

		// Prepare options.
		$class = isset($options['class']) ? $options['class'] : '';
		$id = isset($options['id']) ? $options['id'] : 'jsnlink';
		$href = isset($options['href']) ? $options['href'] : '#';
		$text = isset($options['text']) ? $options['text'] : '';

		// Generate button's HTML.
		$html = '
<div class="btn-wrapper ' . $class . '" id="toolbar-' . $id . '">
	<a href="' . $href . '" class="btn toolbar" target="_blank" rel="noopener noreferrer">
		<span class="icon-' . (isset($options['icon']) ? $options['icon'] : 'link') . '"></span>
		' . $text . '
	</a>
</div>';

		return $html;
	}

	public function fetchButton()
	{
	}
}
