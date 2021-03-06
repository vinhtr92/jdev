<?php
/**
 * @version     $Id: default.php 19014 2012-11-28 04:48:56Z thailv $
 * @package     JSNUniform
 * @subpackage  Abouts
 * @author      JoomlaShine Team <support@joomlashine.com>
 * @copyright   Copyright (C) 2016 JoomlaShine.com. All Rights Reserved.
 * @license     GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// Display messages
if (JFactory::getApplication()->input->getInt('ajax') != 1)
{
	echo $this->msgs;
}

$products = JSNUniformHelper::getDependentExtensions();

// Display about
JSNHtmlGenerate::about($products);
