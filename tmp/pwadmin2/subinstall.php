<?php
/**
 * @version    $Id$
 * @package    JSN_PowerAdmin_2
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

if (!class_exists('JSNInstallerScript'))
{
	// Get path to JSN Installer class file
	is_readable($base = dirname(__FILE__) . '/administrator/components/com_poweradmin2/jsninstaller.php') ||
		 is_readable($base = dirname(__FILE__) . '/jsninstaller.php') ||
		 is_readable($base = JPATH_ROOT . '/administrator/components/com_poweradmin2/jsninstaller.php') || $base = null;

	if (!empty($base))
	{
		require_once $base;
	}
}

/**
 * Class for finalizing JSN PowerAdmin installation.
 *
 * @package  JSN_PowerAdmin_2
 * @since    1.0.0
 */
class Com_PowerAdmin2InstallerScript extends JSNInstallerScript
{

	/**
	 * Implement preflight hook.
	 *
	 * @param   string  $route  Route type: install, update or uninstall.
	 * @param   object  $_this  The installer object.
	 *
	 * @return  boolean
	 */
	public function preflight($route, $_this)
	{
		$check = parent::preflight($route, $_this);

		if ($check)
		{
			// Keep table from JSN PowerAdmin gen. 1.
			$dbo = JFactory::getDbo();
			$tables = $dbo->getTableList();

			foreach ($tables as $table)
			{
				if (strpos($table, '_jsn_poweradmin_') !== false)
				{
					// Rename table to compatible with JSN PowerAdmin gen. 2.
					$dbo->setQuery("RENAME TABLE {$table} TO " . str_replace('_jsn_poweradmin_', '_jsn_poweradmin2_', $table) . ';')->execute();
				}
			}

			// Remove JSN PowerAdmin gen. 1 first.
			foreach ($this->dependencies as $i => $extension)
			{
				if (isset($extension->remove) && (int) $extension->remove > 0)
				{
					$this->removeExtension($extension);

					unset($this->dependencies[$i]);
				}
			}
		}

		return $check;
	}

	/**
	 * Implement postflight hook.
	 *
	 * @param   string  $route  Route type: install, update or uninstall.
	 * @param   object  $_this  The installer object.
	 *
	 * @return  boolean
	 */
	public function postflight($route, $_this)
	{
		parent::postflight($route, $_this);

		// Get a database connector object.
		$db = JFactory::getDbo();

		try
		{
			// Make the execution order of the system plugin of JSN PowerAdmin as early as possible.
			$qr = $db->getQuery(true)
				->update('#__extensions')
				->set('ordering = -9')
				->where("element = 'poweradmin2'")
				->where("type = 'plugin'")
				->where("folder = 'system'");

			$db->setQuery($qr)->execute();

			try
			{
				// If admin bar is enabled, unpublish Joomla built-in Admin Menu module.
				$qr = $db->getQuery(true)
					->select('value')
					->from('#__jsn_poweradmin2_config')
					->where('name = "enable_adminbar"');

				$adminBarEnabled = $db->setQuery($qr)->loadResult();
				$adminBarEnabled = empty($adminBarEnabled) ? 1 : (int) $adminBarEnabled;

				$qr = $db->getQuery(true)
					->update('#__modules')
					->set('published = ' . ( $adminBarEnabled ? 0 : 1 ))
					->where('client_id = 1')
					->where("module = 'mod_menu'")
					->where("position = 'menu'");

				$db->setQuery($qr)->execute();

				// Then, publish the admin bar module of JSN PowerAdmin.
				$qr = $db->getQuery(true)
					->update('#__modules')
					->set('published = ' . ( $adminBarEnabled ? 1 : 0 ))
					->where('client_id = 1')
					->where("module = 'mod_poweradminbar'")
					->where("position = 'menu'");

				$db->setQuery($qr)->execute();
			}
			catch (Exception $e)
			{
				// Do nothing.
			}
		}
		catch (Exception $e)
		{
			throw $e;
		}
	}
}
